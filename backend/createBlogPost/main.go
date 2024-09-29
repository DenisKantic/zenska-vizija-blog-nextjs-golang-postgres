package createBlogPost

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
	DB_CONNECT string
)

type Blog struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ImagePaths  string `json:"image_paths"`
	CreatedAt   string `json:"created_at"`
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	DB_CONNECT = os.Getenv("DB_CONNECT")

}

func dbConn() (*sql.DB, error) {

	fmt.Println("Connection string:", DB_CONNECT)

	db, err := sql.Open("postgres", DB_CONNECT)
	if err != nil {
		return nil, fmt.Errorf("error opening connection: %w", err)
	}
	return db, nil
}

func UploadBlogPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	// Parse multipart form with 100MB max file size
	err := r.ParseMultipartForm(100 << 20) // 100 MB
	if err != nil {
		http.Error(w, "Error processing form", http.StatusInternalServerError)
		fmt.Println("Error parsing form:", err)
		return
	}

	// Retrieve form values
	files := r.MultipartForm.File["images"]
	title := r.FormValue("title")
	description := r.FormValue("description")

	// Validation for title and description
	if title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if description == "" {
		http.Error(w, "Description is required", http.StatusBadRequest)
		return
	}

	if len(files) == 0 {
		http.Error(w, "No images uploaded", http.StatusBadRequest)
		return
	}

	// Generate slug from title
	slug := strings.ToLower(strings.TrimSpace(title))
	slug = strings.ReplaceAll(slug, " ", "-")
	re := regexp.MustCompile(`[^a-z0-9-]`)
	slug = re.ReplaceAllString(slug, "")

	// Debugging: Print form data and file details
	fmt.Println("Title:", title)
	fmt.Println("Description:", description)
	fmt.Println("Number of files:", len(files))

	var filePaths []string

	// Process each uploaded file
	for _, fileHeader := range files {
		// Step 1: Trim leading and trailing spaces from filename
		filename := strings.TrimSpace(fileHeader.Filename)

		// Step 2: Replace all spaces with dashes
		filename = strings.ReplaceAll(filename, " ", "-")

		// Step 3: Ensure valid filename characters (you can extend this if needed)
		re := regexp.MustCompile(`[^a-zA-Z0-9._-]`)
		filename = re.ReplaceAllString(filename, "")

		// Open the uploaded file
		src, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening file", http.StatusInternalServerError)
			fmt.Println("Error opening file:", err)
			return
		}
		defer src.Close()

		// Define the destination path for saving the file
		dstPath := filepath.Join("uploads", filename)
		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			fmt.Println("Error creating file on server:", err)
			return
		}
		defer dst.Close()

		// Copy the file data to the server
		_, err = io.Copy(dst, src)
		if err != nil {
			http.Error(w, "Error copying file", http.StatusInternalServerError)
			fmt.Println("Error copying file:", err)
			return
		}

		// Append the saved file path
		filePaths = append(filePaths, dstPath)

		// Debugging: Confirm the file has been saved
		fmt.Println("File saved successfully:", dstPath)
	}

	// Store file paths in the database
	filePathsStr := "{" + strings.Join(filePaths, ",") + "}"
	err = saveFilePathToDB(filePathsStr, title, description, slug)
	if err != nil {
		http.Error(w, "Error saving to database", http.StatusInternalServerError)
		fmt.Println("Error saving file paths to database:", err)
		return
	}

	// Debugging: File paths stored successfully
	fmt.Println("File paths stored in DB:", filePaths)

	// Return success response
	response := map[string]interface{}{
		"message":    "Files uploaded and stored successfully",
		"file_paths": filePaths,
	}

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

	query := "SELECT ID, title, description, image_paths, created_at, slug FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2"
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
		var dateCreated string
		var slug string

		err := rows.Scan(&id, &title, &description, &imagePaths, &dateCreated, &slug)
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
	_, err = db.Exec("DELETE FROM blogs WHERE ID = $1", id)
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

	err = db.QueryRow("SELECT ID, title, description, image_paths, created_at FROM blogs WHERE slug = $1", slug).
		Scan(&blog.ID, &blog.Title, &blog.Description, &blog.ImagePaths, &blog.CreatedAt)

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
