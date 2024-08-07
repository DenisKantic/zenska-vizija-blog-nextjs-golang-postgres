package createEventPost

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

var (
	DB_USER     string
	DB_PASSWORD string
	DB_NAME     string
	DB_HOST     string
	DB_PORT     string
	JWT_SECRET  string
)

type Event struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Location    string `json:"location"`
	Time        string `json:"time"`
	ImagePaths  string `json:"image_paths"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	DB_USER = os.Getenv("DB_USER")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
	DB_NAME = os.Getenv("DB_NAME")
	DB_HOST = os.Getenv("DB_HOST")
	DB_PORT = os.Getenv("DB_PORT")
}

func dbConn() (*sql.DB, error) {
	psqlInfo := "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable"
	psqlInfo = fmt.Sprintf(psqlInfo, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
	fmt.Println("Connection string:", psqlInfo)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error opening connection: %w", err)
	}
	return db, nil
}

func UploadEventPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	err := r.ParseMultipartForm(250 << 20) // 100 MB max
	if err != nil {
		http.Error(w, "Error processing form", http.StatusInternalServerError)
		return
	}

	files := r.MultipartForm.File["images"]
	title := r.FormValue("eventTitle")
	location := r.FormValue("location")
	time := r.FormValue("time")
	description := r.FormValue("description")

	if title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if description == "" {
		http.Error(w, "Description is required", http.StatusBadRequest)
		return
	}

	if location == "" {
		http.Error(w, "Location is required", http.StatusBadRequest)
		return
	}

	if time == "" {
		http.Error(w, "Time is required", http.StatusBadRequest)
		return
	}

	if len(files) == 0 {
		http.Error(w, "No images uploaded", http.StatusBadRequest)
		return
	}

	var slug = strings.ToLower(title)
	slug = strings.ReplaceAll(title, " ", "-")
	re := regexp.MustCompile(`[^a-z0-9-]`)
	slug = re.ReplaceAllString(slug, "")

	fmt.Println("Title:", title)
	fmt.Println("Description:", description)

	fmt.Println("Extracted files", files)

	var filePaths []string

	for _, file := range files {
		// open the uploaded file
		src, err := file.Open()
		if err != nil {
			http.Error(w, "Error opening the file", http.StatusInternalServerError)
			return
		}

		defer src.Close()

		// create a new file in the server
		dstPath := filepath.Join("events", file.Filename) // FILE NAME FOLDER
		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, "Error creating a new file in the server", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		// copy the uploaded file

		// Copy the uploaded file to the server
		_, err = io.Copy(dst, src)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// collect file paths
		filePaths = append(filePaths, dstPath)
	}
	// insert the file paths into the database
	filePathsStr := "{" + strings.Join(filePaths, ",") + "}"
	err = saveFilePathToDB(filePathsStr, title, location, time, description, slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// prepare the JSON response
	response := map[string]interface{}{
		"message":    "Files uploaded and paths stored successfully",
		"file_paths": filePaths, // Add file paths to the response
	}

	// Set content type and return the JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func saveFilePathToDB(filePaths string, title string, location string, time string, description string, slug string) error {
	db, err := dbConn()
	if err != nil {
		return fmt.Errorf("error connecting to database: %v", err)
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO events (image_paths, title, location, time, description, slug) VALUES ($1,$2,$3, $4, $5, $6)", filePaths, title, location, time, description, slug)
	if err != nil {
		return fmt.Errorf("error saving file to database: %v", err)
	}

	return nil
}

// GetAllEvents handles the GET request to retrieve all event entries
func GetAllEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("pageSize")

	page := 1
	pageSize := 16

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if pageSizeStr != "" {
		if s, err := strconv.Atoi(pageSizeStr); err == nil && s > 0 {
			pageSize = s
		}
	}

	offset := (page - 1) * pageSize

	db, err := dbConn()
	if err != nil {
		http.Error(w, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Query to get the total number of blogs
	var totalCount int
	countQuery := "SELECT COUNT(*) FROM events"
	err = db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		http.Error(w, "Error querying database for count", http.StatusInternalServerError)
		return
	}

	// Calculate total pages
	totalPages := (totalCount + pageSize - 1) / pageSize

	query := "SELECT id, title, description, time, location, image_paths, created_at, updated_at, slug FROM events ORDER BY created_at DESC LIMIT $1 OFFSET $2"
	rows, err := db.Query(query, pageSize, offset)
	if err != nil {
		http.Error(w, "Error querying database"+err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("getting from database")
	defer rows.Close()

	var events []map[string]interface{}

	for rows.Next() {
		var id int
		var title, description, imagePaths, time, location string
		var dateCreated, updatedAt string
		var slug string

		err := rows.Scan(&id, &title, &description, &time, &location, &imagePaths, &dateCreated, &updatedAt, &slug)
		if err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		event := map[string]interface{}{
			"id":           id,
			"title":        title,
			"description":  description,
			"image_paths":  imagePaths,
			"date_created": dateCreated,
			"time":         time,
			"location":     location,
			"updated_at":   updatedAt,
			"slug":         slug,
		}

		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error with rows", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"events":      events,
		"totalPages":  totalPages,
		"currentPage": page,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	// Extract ID from URL path
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}

	db, err := dbConn()
	if err != nil {
		http.Error(w, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Fetch file paths from the database
	var filePathsStr string
	err = db.QueryRow("SELECT image_paths FROM events WHERE id = $1", id).Scan(&filePathsStr)
	if err != nil {
		http.Error(w, "Error fetching file paths from database", http.StatusInternalServerError)
		return
	}

	// Delete the blog post from the database
	_, err = db.Exec("DELETE FROM events WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error deleting blog from database", http.StatusInternalServerError)
		return
	}

	// Convert file paths from string format to slice
	filePathsStr = strings.Trim(filePathsStr, "{}")
	filePathsList := strings.Split(filePathsStr, ",")

	// Delete each file from the file server
	for _, path := range filePathsList {
		// Ensure paths do not include the 'uploads/' directory again
		// Check if path starts with 'uploads/' and remove it
		if strings.HasPrefix(path, "events/") {
			path = strings.TrimPrefix(path, "events/")
		}

		fullPath := filepath.Join("events", path)
		fmt.Println("Attempting to delete:", fullPath)

		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			fmt.Println("File does not exist:", fullPath)
			continue
		}
		err := os.Remove(fullPath)
		if err != nil {
			http.Error(w, "Error deleting file from server: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

func GetOneItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	slug := r.URL.Query().Get("slug")
	var event Event

	if slug == "" {
		http.Error(w, "Missing slug", http.StatusBadRequest)
		return
	}

	db, err := dbConn()
	if err != nil {
		http.Error(w, "Error connecting to database", http.StatusInternalServerError)
		return
	}

	defer db.Close()

	err = db.QueryRow("SELECT id, title, description, time, location, image_paths, created_at, updated_at FROM events WHERE slug = $1", slug).
		Scan(&event.ID, &event.Time, &event.Location, &event.Title, &event.Description, &event.ImagePaths, &event.CreatedAt, &event.UpdatedAt)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "Item not found", http.StatusNotFound)
			return
		} else {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(event); err != nil {
		http.Error(w, "Failed to encode item", http.StatusInternalServerError)
	}

}
