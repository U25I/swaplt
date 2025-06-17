<?php
// users.php - Handles user registration (signup) and login

// Include database connection
require_once 'db_connect.php'; // Ensure db_connect.php exists and has your database connection setup

// CORS headers: ALLOW your React app's origin
// IMPORTANT: For development, '*' is fine. For production, replace '*' with your specific frontend URL (e.g., 'http://localhost:3000')
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Add PUT/DELETE if implementing profile updates/deletion
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS requests (browsers send this before actual POST for complex requests)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = []; // Initialize response array

// Get JSON input from the React app
$input = json_decode(file_get_contents('php://input'), true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Invalid JSON input."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Determine action based on a 'type' field in the incoming JSON (e.g., 'signup' or 'login')
    $action_type = $input['type'] ?? '';

    if ($action_type === 'signup') {
        $username = $input['username'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($username) || empty($email) || empty($password)) {
            http_response_code(400); // Bad Request
            $response = ["status" => "error", "message" => "All fields are required for signup."];
        } else {
            // Hash the password before storing it
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // --- SQL to insert new user (Prepared statement for security) ---
            // Ensure your 'users' table has 'username', 'email', and 'password_hash' columns
            /*
            Example SQL to create table (if you haven't already):
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            */
            $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            
            if (!$stmt) {
                 http_response_code(500);
                 $response = ["status" => "error", "message" => "Failed to prepare signup statement: " . $conn->error];
            } else {
                $stmt->bind_param("sss", $username, $email, $hashed_password);

                if ($stmt->execute()) {
                    $response = ["status" => "success", "message" => "User registered successfully!"];
                    http_response_code(201); // Created
                } else {
                    // Check for duplicate entry error (e.g., username or email already exists)
                    if ($conn->errno == 1062) {
                        $response = ["status" => "error", "message" => "Username or email already exists."];
                        http_response_code(409); // Conflict
                    } else {
                        $response = ["status" => "error", "message" => "Error registering user: " . $stmt->error];
                        http_response_code(500); // Internal Server Error
                    }
                }
                $stmt->close();
            }
        }
    } elseif ($action_type === 'login') {
        $email_or_username = $input['email_or_username'] ?? ''; // Can be email or username
        $password = $input['password'] ?? '';

        if (empty($email_or_username) || empty($password)) {
            http_response_code(400);
            $response = ["status" => "error", "message" => "Email/Username and password are required for login."];
        } else {
            // --- SQL to find user by email or username ---
            // IMPORTANT: Make sure your `users` table has `email`, `username`, and `password_hash` columns.
            // The `password_hash` column is where the output of password_hash() is stored.
            $stmt = $conn->prepare("SELECT id, username, email, password_hash FROM users WHERE email = ? OR username = ?");
            
            if (!$stmt) {
                http_response_code(500);
                $response = ["status" => "error", "message" => "Failed to prepare login statement: " . $conn->error];
            } else {
                $stmt->bind_param("ss", $email_or_username, $email_or_username);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $user = $result->fetch_assoc();
                    // Verify the password against the stored hash
                    if (password_verify($password, $user['password_hash'])) {
                        // Password is correct, perform login (e.g., set session, return token)
                        // For now, we'll just return user info (excluding password hash)
                        $response = [
                            "status" => "success",
                            "message" => "Login successful!",
                            "user" => [
                                "id" => $user['id'],
                                "username" => $user['username'],
                                "email" => $user['email']
                                // Do NOT send the password hash back to the frontend
                            ]
                        ];
                    } else {
                        http_response_code(401); // Unauthorized
                        $response = ["status" => "error", "message" => "Invalid credentials."];
                    }
                } else {
                    http_response_code(401); // Unauthorized
                    $response = ["status" => "error", "message" => "Invalid credentials."];
                }
                $stmt->close();
            }
        }
    } else {
        http_response_code(400); // Bad Request
        $response = ["status" => "error", "message" => "Invalid action type."];
    }
} else {
    http_response_code(405); // Method Not Allowed
    $response = ["status" => "error", "message" => "Method Not Allowed"];
}

// Close database connection
// This assumes $conn is available from db_connect.php and is properly managed.
// For persistent connections or connection pools, this might be handled differently.
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

// Send JSON response
echo json_encode($response);
?>
