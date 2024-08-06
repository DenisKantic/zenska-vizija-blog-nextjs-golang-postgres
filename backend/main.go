package main

import (
	"backend/auth"
	"backend/createBlogPost"
	"backend/createEventPost"
	"fmt"
	"log"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	// Write "Hello, World!" to the response
	fmt.Fprintln(w, "Hello, World!")
}

func ServeStaticFiles(mux *http.ServeMux) {
	staticDir := "uploads"
	fmt.Printf("Serving static files from %s\n", staticDir)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(staticDir))))
}

func setupRoutes() {

	mux := http.NewServeMux()

	// API routes for BlogPost
	mux.HandleFunc("/createBlog", createBlogPost.UploadBlogPost)
	mux.HandleFunc("/blogs", createBlogPost.GetAllBlogs)
	mux.HandleFunc("/deleteBlog", createBlogPost.DeleteBlog)
	mux.HandleFunc("/getBlogItem/", createBlogPost.GetOneItem)
	///////////////////////////////////////////////////////////

	// API routes for EventPost
	mux.HandleFunc("/createEvent", createEventPost.UploadEventPost)

	// mux.HandleFunc("/register", auth.Register)
	mux.HandleFunc("/login", auth.Login)
	mux.HandleFunc("/logout", auth.Logout)
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
