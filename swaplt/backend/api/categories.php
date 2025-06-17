<?php
// categories.php - Fetches categories from the 'categories' table

require_once 'db_connect.php'; // Your database connection file

header("Access-Control-Allow-Origin: *"); // Allow all origins for development
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow GET and preflight OPTIONS requests
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Allow necessary headers
header("Content-Type: application/json"); // Always send JSON response

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Corrected SQL query: Selects the 'name' column from the 'categories' table
    $sql = "SELECT name FROM categories ORDER BY name ASC"; //
    $result = $conn->query($sql);

    if ($result) {
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['name']; // Fetch the value from the 'name' column
        }
        $response = ["status" => "success", "message" => "Categories fetched successfully.", "data" => $categories];
    } else {
        http_response_code(500); // Internal Server Error
        $response = ["status" => "error", "message" => "Error fetching categories: " . $conn->error];
    }
} else {
    http_response_code(405); // Method Not Allowed
    $response = ["status" => "error", "message" => "Method Not Allowed"];
}

$conn->close();
echo json_encode($response);
?>