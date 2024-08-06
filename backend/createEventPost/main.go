package createEventPost

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
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

	err := r.ParseMultipartForm(100 << 20) // 100 MB max
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
