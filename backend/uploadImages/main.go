package uploadImages

import (
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
	}
}
