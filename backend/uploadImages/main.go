package uploadImages

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
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
)

type Blog struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
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

func UploadImages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	err := r.ParseMultipartForm(100 << 20) // 100 MB max
	if err != nil {
		http.Error(w, "Error processing form", http.StatusInternalServerError)
		return
	}

	files := r.MultipartForm.File["images"]
	title := r.FormValue("title")
	description := r.FormValue("description")

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
		dstPath := filepath.Join("uploads", file.Filename) // FILE NAME FOLDER
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
	err = saveFilePathToDB(filePathsStr, title, description, slug)
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

func saveFilePathToDB(filePaths string, title string, description string, slug string) error {
	db, err := dbConn()
	if err != nil {
		return fmt.Errorf("error connecting to database: %v", err)
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO blogs (image_paths, title, description, slug) VALUES ($1,$2,$3, $4)", filePaths, title, description, slug)
	if err != nil {
		return fmt.Errorf("error saving file to database: %v", err)
	}

	return nil
}

// GetAllBlogs handles the GET request to retrieve all blog entries
func GetAllBlogs(w http.ResponseWriter, r *http.Request) {
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
	countQuery := "SELECT COUNT(*) FROM blogs"
	err = db.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		http.Error(w, "Error querying database for count", http.StatusInternalServerError)
		return
	}

	// Calculate total pages
	totalPages := (totalCount + pageSize - 1) / pageSize

	query := "SELECT id, title, description, image_paths, created_at, updated_at, slug FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2"
	rows, err := db.Query(query, pageSize, offset)
	if err != nil {
		http.Error(w, "Error querying database"+err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("getting from database")
	defer rows.Close()

	var blogs []map[string]interface{}

	for rows.Next() {
		var id int
		var title, description, imagePaths string
		var dateCreated, updatedAt string
		var slug string

		err := rows.Scan(&id, &title, &description, &imagePaths, &dateCreated, &updatedAt, &slug)
		if err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}

		blog := map[string]interface{}{
			"id":           id,
			"title":        title,
			"description":  description,
			"image_paths":  imagePaths,
			"date_created": dateCreated,
			"updated_at":   updatedAt,
			"slug":         slug,
		}

		blogs = append(blogs, blog)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error with rows", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"blogs":       blogs,
		"totalPages":  totalPages,
		"currentPage": page,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func DeleteBlog(w http.ResponseWriter, r *http.Request) {
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
	err = db.QueryRow("SELECT image_paths FROM blogs WHERE id = $1", id).Scan(&filePathsStr)
	if err != nil {
		http.Error(w, "Error fetching file paths from database", http.StatusInternalServerError)
		return
	}

	// Delete the blog post from the database
	_, err = db.Exec("DELETE FROM blogs WHERE id = $1", id)
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
		if strings.HasPrefix(path, "uploads/") {
			path = strings.TrimPrefix(path, "uploads/")
		}

		fullPath := filepath.Join("uploads", path)
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
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	slug := r.URL.Query().Get("slug")
	var blog Blog

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

	err = db.QueryRow("SELECT id, title, description, image_paths, created_at, updated_at FROM blogs WHERE slug = $1", slug).
		Scan(&blog.ID, &blog.Title, &blog.Description, &blog.ImagePaths, &blog.CreatedAt, &blog.UpdatedAt)

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

	if err := json.NewEncoder(w).Encode(blog); err != nil {
		http.Error(w, "Failed to encode item", http.StatusInternalServerError)
	}

}
