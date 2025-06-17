<?php
$servername = "localhost"; 
$username = "root";       
$password = "Rakshitha12";           
$dbname = "ai_workout_coach_db"; 
$port = 3307;              
$conn = new mysqli($servername, $username, $password, $dbname, $port);
if ($conn->connect_error) {
     http_response_code(500); 
     header('Content-Type: application/json');
     die(json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>
