package main

import (
	"backend/auth"
	"backend/createBlogPost"
	"backend/createEventPost"
	"database/sql"
	"fmt"
	"log"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	// Write "Hello, World!" to the response
	fmt.Fprintln(w, "Hello, World!")
}

func ServeStaticFiles(mux *http.ServeMux) {
	staticDirUploads := "uploads"
	staticDirEvents := "events"

	fmt.Printf("Serving static files from %s\n", staticDirUploads)
	fmt.Printf("Serving static files from %s\n", staticDirEvents)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(staticDirUploads))))
	mux.Handle("/events/", http.StripPrefix("/events/", http.FileServer(http.Dir(staticDirEvents))))

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
	mux.HandleFunc("/events", createEventPost.GetAllEvents)
	mux.HandleFunc("/deleteEvent", createEventPost.DeleteEvent)
	mux.HandleFunc("/getEventItem/", createEventPost.GetOneItem)

	// mux.HandleFunc("/register", auth.Register)
	mux.HandleFunc("/login", auth.Login)
	mux.HandleFunc("/logout", auth.Logout)
	ServeStaticFiles(mux)

	log.Fatal(http.ListenAndServe(":8080", mux))

}

func main() {

	email := "amelahajvaz555@gmail.com"
	password := "amelazenskavizija1;"

	// Call the function to register a user manually
	err := RegisterUserManually(email, password)
	if err != nil {
		fmt.Printf("Error registering user: %v\n", err)
	} else {
		fmt.Println("User registered successfully!")
	}
	fmt.Println("Server is running on 8080 port")
	setupRoutes()
	//

	//staticDir := "testing/"
	//http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(staticDir))))
	//
	//fmt.Println("Serving static files on http://localhost:8080/")
	//log.Fatal(http.ListenAndServe(":8080", nil))
}

func RegisterUserManually(email string, password string) error {
	// Connect to the database
	db, err := dbCon()
	if err != nil {
		return fmt.Errorf("error connecting to database: %v", err)
	}
	defer db.Close()

	// Insert user data into the database
	_, err = db.Exec("INSERT INTO users (email, password) VALUES ($1, $2)", email, password)
	if err != nil {
		return fmt.Errorf("error inserting user into database: %v", err)
	}

	fmt.Println("User is created with email:", email)
	return nil
}

func dbCon() (*sql.DB, error) {
	psqlInfo := "postgresql://zenskavizija:zenskavizija1;@postgres:5434/zenskavizijadb?sslmode=disable"

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error opening connection: %w", err)
	}
	return db, nil
}
