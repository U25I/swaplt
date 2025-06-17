<?php
ob_start();
// C:\xampp\htdocs\backend\api\data.php

// --- IMPORTANT: ONLY ONE SET OF CORS HEADERS AND OPTIONS HANDLING ---
// Allow requests from your React development server (default is port 3000)
header("Access-Control-Allow-Origin: http://localhost:3000");
// Allow the HTTP methods your React app will use
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Allow specific headers to be sent from the client
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// Tell the client that the response will be JSON
header("Content-Type: application/json");

// Handle preflight OPTIONS requests (browsers send these before complex POST/PUT/DELETE requests)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // Stop script execution after sending OPTIONS headers
}

$response = []; // Initialize an empty array for our JSON response

// --- Handle different HTTP methods ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response['status'] = 'success';
    $response['message'] = 'Hello from PHP Backend (XAMPP)!';
    $response['timestamp'] = date('Y-m-d H:i:s');
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data (this is how React's fetch/Axios sends JSON)
    $input = file_get_contents('php://input');
    $data = json_decode($input, true); // Decode the JSON string into a PHP associative array

    // Extract fields sent from Contact.js form
    $name = $data['name'] ?? 'Guest';
    $email = $data['email'] ?? 'N/A';
    $subject = $data['subject'] ?? 'No Subject'; // <--- Added for Contact.js
    $userMessage = $data['message'] ?? 'No Message'; // <--- Added for Contact.js (key is 'message' from formData)

    $response['status'] = 'success';
    $response['message'] = 'Thank you, ' . htmlspecialchars($name) . '! Your message has been received.';
    $response['received_data'] = [
        'name' => htmlspecialchars($name),
        'email' => htmlspecialchars($email),
        'subject' => htmlspecialchars($subject),
        'message' => htmlspecialchars($userMessage)
    ];
} else {
    // If an unsupported method is used
    http_response_code(405); // Set HTTP status code to "Method Not Allowed"
    $response['status'] = 'error';
    $response['message'] = 'Method Not Allowed';
}

// --- Encode and send the JSON response ---
ob_end_clean(); // Clears any buffered output before sending the final JSON

echo json_encode($response);
?>