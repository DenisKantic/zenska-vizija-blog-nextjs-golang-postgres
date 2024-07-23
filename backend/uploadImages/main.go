package uploadImages

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func TestingFunction(w http.ResponseWriter, r *http.Request) {
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
		dst, err := os.Create(filepath.Join("uploads", file.Filename))
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

		// Add the file path to the array
		filePaths = append(filePaths, filepath.Join("uploads", file.Filename))
	}

	// Retrieve all file paths from the uploads directory
	filesInDir, err := os.ReadDir("uploads")
	if err != nil {
		http.Error(w, "Error reading uploads directory", http.StatusInternalServerError)
		return
	}

	var allFilePaths []string
	for _, file := range filesInDir {
		if !file.IsDir() {
			allFilePaths = append(allFilePaths, filepath.Join("uploads", file.Name()))
		}
	}

	// Convert the array to JSON
	jsonResponse, err := json.Marshal(allFilePaths)
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
		return
	}

	// Set content type and return the JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}
