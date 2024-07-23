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

func setupRoutes() {

	mux := http.NewServeMux()

	mux.HandleFunc("/uploadImages", uploadImages.TestingFunction)
	mux.HandleFunc("/", HelloHandler)
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func main() {

	fmt.Println("Server is running on 8080 port")
	setupRoutes()
}
