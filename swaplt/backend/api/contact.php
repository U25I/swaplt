<?php
// contact.php - Handles contact form submissions and informational GET requests

// Essential for API endpoints to prevent HTML errors and enable output buffering
ini_set('display_errors', 0); // Crucial for preventing HTML errors in API responses
ini_set('display_startup_errors', 0);
error_reporting(E_ALL); // Still log all errors to the PHP error log
ob_start(); // Start output buffering at the very beginning

require_once 'db_connect.php'; // Your database connection file

header("Access-Control-Allow-Origin: http://localhost:3000"); // Specify your React app's URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow POST and GET
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Exit immediately for OPTIONS requests
}

$response = array();

// --- Handle GET requests (for informational purposes) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    http_response_code(200);
    $response = array(
        "status" => "info",
        "message" => "This is the Contact API endpoint. Use a POST request to submit contact form data."
    );
}
// --- Handle POST requests (for actual form submission) ---
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw JSON input from the request body
    $json_input = file_get_contents('php://input');
    $data = json_decode($json_input, true); // Decode JSON into an associative array

    // Check if JSON decoding was successful and data is an array
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Bad Request
        $response = array("status" => "error", "message" => "Invalid JSON input.");
    } else {
        // Access data from the decoded JSON array
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        // Removed 'subject' as it's not sent by the frontend
        $message = $data['message'] ?? '';

        // Basic validation (now without 'subject')
        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400); // Bad Request
            $response = array("status" => "error", "message" => "All fields (Name, Email, Message) are required.");
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400); // Bad Request
            $response = array("status" => "error", "message" => "Invalid email format.");
        } else {
            // Example: Inserting into a 'contact_messages' table
            // This assumes your table 'contact_messages' now only has 'name', 'email', 'message' columns
            // You would need to ensure your table structure matches this.
            // Example SQL (if you need to recreate/alter your table):
            // CREATE TABLE contact_messages (
            //     id INT AUTO_INCREMENT PRIMARY KEY,
            //     name VARCHAR(255) NOT NULL,
            //     email VARCHAR(255) NOT NULL,
            //     message TEXT NOT NULL,
            //     submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            // );

            try {
                // Modified SQL query and bind_param to exclude 'subject'
                $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
                if ($stmt === false) {
                    throw new Exception("Prepare statement failed: " . $conn->error);
                }

                $stmt->bind_param("sss", $name, $email, $message); // 'sss' for three strings

                if ($stmt->execute()) {
                    http_response_code(200); // OK
                    $response = array("status" => "success", "message" => "Your message has been sent successfully!");
                } else {
                    throw new Exception("Execute statement failed: " . $stmt->error);
                }
                $stmt->close();

            } catch (Exception $e) {
                http_response_code(500); // Internal Server Error
                $response = array("status" => "error", "message" => "Failed to send message: " . $e->getMessage());
                error_log("Contact form submission error: " . $e->getMessage()); // Log the actual error
            }
        }
    }
}
// --- If any other method is used ---
else {
    http_response_code(405); // Method Not Allowed
    $response = array("status" => "error", "message" => "Method Not Allowed. Only GET and POST requests are accepted.");
}

// Close connection at the very end of the script
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

// Flush the output buffer and send the JSON response
ob_end_flush();
echo json_encode($response);
?>