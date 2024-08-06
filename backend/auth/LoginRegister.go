package auth

import (
	"database/sql"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	DB_USER     string
	DB_PASSWORD string
	DB_NAME     string
	DB_HOST     string
	DB_PORT     string
	JWT_SECRET  string
)

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

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
	JWT_SECRET = os.Getenv("JWT_SECRET")
}

func dbCon() (*sql.DB, error) {
	psqlInfo := "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable"
	psqlInfo = fmt.Sprintf(psqlInfo, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
	fmt.Println("Connection string:", psqlInfo)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("error opening connection: %w", err)
	}
	return db, nil
}

func GenerateToken(email string) (string, error) {
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(JWT_SECRET))
}

// middleware to verify token
func VerifyToken(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unathorized", http.StatusUnauthorized)
			return
		}

		token, err := jwt.ParseWithClaims(tokenString.Value, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(JWT_SECRET), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Unathorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true") // Allow credentials

	if r.Method == http.MethodOptions {
		return
	}

	err := r.ParseMultipartForm(100 << 20) // 100 MB max
	if err != nil {
		http.Error(w, "Error processing form", http.StatusInternalServerError)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")

	db, err := dbCon()
	if err != nil {
		http.Error(w, "error connecting to database", http.StatusInternalServerError)
		return
	}

	defer db.Close()

	_, err = db.Exec("INSERT INTO users (email, password) VALUES ($1,$2)", email, password)
	if err != nil {
		http.Error(w, "Error inserting user into database", http.StatusInternalServerError)
		return
	}
	fmt.Print("User is created")

	w.WriteHeader(http.StatusOK)
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true") // Allow credentials

	if r.Method == http.MethodOptions {
		return
	}

	err := r.ParseMultipartForm(100 << 20) // 100 MB max
	if err != nil {
		http.Error(w, "Error processing form", http.StatusInternalServerError)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")

	db, err := dbCon()
	if err != nil {
		http.Error(w, "Error connecting to database", http.StatusInternalServerError)
		return
	}

	defer db.Close()

	var storedPassword string
	err = db.QueryRow("SELECT password FROM users WHERE email = $1", email).Scan(&storedPassword)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if password != storedPassword {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	token, err := GenerateToken(email)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		HttpOnly: true,
		Secure:   true, // true if using https
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})

	fmt.Print("User is logged in")

	w.WriteHeader(http.StatusOK)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true") // Allow credentials

	if r.Method == http.MethodOptions {
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		HttpOnly: true,
		Path:     "/",
		MaxAge:   -1,
	})

	fmt.Println("\nUser is logged out")

	w.WriteHeader(http.StatusOK)
}
