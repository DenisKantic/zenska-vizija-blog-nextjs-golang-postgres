package main

import (
	"fmt"
	"log"
	"net/http"
)
import "backend/uploadImages"

func main() {
	fmt.Println(uploadImages.TestingFunction())
	fmt.Println("test again")

	mux := http.NewServeMux()

	mux.HandleFunc("/uploadImages", uploadImages.TestingFunction())
	fmt.Println("Server is running on 8080 port")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
