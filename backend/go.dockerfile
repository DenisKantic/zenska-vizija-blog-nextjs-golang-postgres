# Dockerfile.go

# Use the official Golang image as the base image
FROM golang:1.22-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first to take advantage of Docker cache
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# copy the env 
COPY .env /app/.env

# Build the Go application
RUN go build -o blogapp

# Expose the application on port 8080
EXPOSE 8080

# Run the executable
CMD ["./blogapp"]