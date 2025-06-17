<?php
// add_category.php - Handles adding a new category and its description

require_once 'db_connect.php'; // Your database connection file

header("Access-Control-Allow-Origin: *"); // Allow all origins for development
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and preflight OPTIONS requests
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Allow necessary headers
header("Content-Type: application/json"); // Always send JSON response

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // When sending FormData from React, PHP populates $_POST superglobal
    // Access 'name' and 'description' as appended in React's FormData
    $categoryName = isset($_POST['name']) ? trim($_POST['name']) : ''; // <<< Corrected to $_POST['name']
    $categoryDescription = isset($_POST['description']) ? trim($_POST['description']) : '';

    if (empty($categoryName) || empty($categoryDescription)) {
        http_response_code(400); // Bad Request
        $response = ["status" => "error", "message" => "Category name and description cannot be empty."];
    } else {
        // Prepare the INSERT statement to match your table's columns: 'name' and 'description'
        $stmt = $conn->prepare("INSERT INTO categories (name, description) VALUES (?, ?)"); // <<< Corrected to (name, description)

        if ($stmt === false) {
             // This indicates an SQL error in the prepare statement
             http_response_code(500);
             $response = ["status" => "error", "message" => "Database error preparing statement: " . $conn->error];
        } else {
            $stmt->bind_param("ss", $categoryName, $categoryDescription); // "ss" for two strings

            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Category '" . htmlspecialchars($categoryName) . "' added successfully!"];
            } else {
                // Check for duplicate entry error (if 'name' column is UNIQUE)
                if ($conn->errno == 1062) { // MySQL error code for duplicate entry
                    http_response_code(409); // Conflict
                    $response = ["status" => "error", "message" => "Category '" . htmlspecialchars($categoryName) . "' already exists."];
                } else {
                    http_response_code(500); // Internal Server Error
                    $response = ["status" => "error", "message" => "Error adding category: " . $stmt->error];
                }
            }
            $stmt->close();
        }
    }
} else {
    http_response_code(405); // Method Not Allowed
    $response = ["status" => "error", "message" => "Method Not Allowed"];
}

$conn->close();
echo json_encode($response);
?>