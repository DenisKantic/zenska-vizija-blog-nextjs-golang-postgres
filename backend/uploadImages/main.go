package uploadImages

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	DB_USER     string
	DB_PASSWORD string
	DB_NAME     string
	DB_HOST     string
	DB_PORT     string
)

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
	err = saveFilePathToDB(filePathsStr, title, description)
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

func saveFilePathToDB(filePaths string, title string, description string) error {
	db, err := dbConn()
	if err != nil {
		return fmt.Errorf("error connecting to database: %v", err)
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO blogs (image_paths, title, description) VALUES ($1,$2,$3)", filePaths, title, description)
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

	db, err := dbConn()
	if err != nil {
		http.Error(w, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, title, description, image_paths, created_at, updated_at FROM blogs ORDER BY created_at DESC")
	if err != nil {
		http.Error(w, "Error querying database"+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var blogs []map[string]interface{}

	for rows.Next() {
		var id int
		var title, description, imagePaths string
		var dateCreated, updatedAt string

		err := rows.Scan(&id, &title, &description, &imagePaths, &dateCreated, &updatedAt)
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
		}

		blogs = append(blogs, blog)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error with rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(blogs)
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

	rows, err := db.Query("DELETE FROM blogs WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Error querying database"+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	w.WriteHeader(http.StatusOK)

}
