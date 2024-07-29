package main

import (
	"backend/uploadImages"
	"fmt"
	"log"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	// Write "Hello, World!" to the response
	fmt.Fprintln(w, "Hello, World!")
}

func ServeStaticFiles(mux *http.ServeMux) {
	staticDir := "uploads/"
	fmt.Printf("Serving static files from %s\n", staticDir)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(staticDir))))
}

func setupRoutes() {

	mux := http.NewServeMux()

	mux.HandleFunc("/uploadImages", uploadImages.UploadImages)
	mux.HandleFunc("/blogs", uploadImages.GetAllBlogs)
	mux.HandleFunc("/deleteBlog", uploadImages.DeleteBlog)
	mux.HandleFunc("/", HelloHandler)
	ServeStaticFiles(mux)

	log.Fatal(http.ListenAndServe(":8080", mux))

}

func main() {
	fmt.Println("Server is running on 8080 port")
	setupRoutes()

	//staticDir := "testing/"
	//http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(staticDir))))
	//
	//fmt.Println("Serving static files on http://localhost:8080/")
	//log.Fatal(http.ListenAndServe(":8080", nil))
}
