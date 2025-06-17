<?php
// upload_items.php - Handles uploading new items and images

// !!! IMPORTANT FOR DEBUGGING !!!
// Set display_errors to 1 temporarily to see PHP errors directly.
// Change back to 0 when deployed to production.
ini_set('display_errors', 1); // <--- Set to 1 for debugging
ini_set('display_startup_errors', 1); // <--- Set to 1 for debugging
error_reporting(E_ALL); // Still log all errors to the PHP error log
ob_start(); // Start output buffering at the very beginning

require_once 'db_connect.php'; // Your database connection file

header("Access-Control-Allow-Origin: http://localhost:3000"); // Specify your React app's URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow POST for item upload
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Exit immediately for OPTIONS requests
}

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get text data from $_POST (assuming FormData sends them this way)
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null; // Ensure user_id is an integer
    $itemName = $_POST['itemName'] ?? ''; // From React's formData.itemName
    $itemDescription = $_POST['itemDescription'] ?? ''; // From React's formData.itemDescription
    $itemCategory = $_POST['itemCategory'] ?? '';
    $itemQuantity = isset($_POST['itemQuantity']) ? intval($_POST['itemQuantity']) : 1; // Default to 1, ensure integer
    $itemDimensions = $_POST['itemDimensions'] ?? '';
    $itemCondition = $_POST['itemCondition'] ?? '';
    $location = $_POST['location'] ?? ''; // From React's formData.location
    $exchangeReason = $_POST['exchangeReason'] ?? '';
    
    // Pickup options can be an array, handle it as such.
    $pickupOptions = isset($_POST['pickupOptions']) ? (is_array($_POST['pickupOptions']) ? implode(', ', $_POST['pickupOptions']) : $_POST['pickupOptions']) : '';
    
    $desiredItem = $_POST['desiredItem'] ?? '';
    $exchangeMethod = $_POST['exchangeMethod'] ?? '';
    $status = 'proposed'; // Set default status to 'proposed' for new uploads

    // Basic validation
    if (empty($user_id) || empty($itemName) || empty($itemDescription) || empty($itemCategory) || empty($itemQuantity) || empty($itemCondition) || empty($location) || empty($exchangeMethod)) {
        http_response_code(400); // Bad Request
        $response = array("status" => "error", "message" => "Missing required fields (including user_id).");
        echo json_encode($response);
        ob_end_flush(); // Flush buffer and exit
        exit();
    }

    $conn->begin_transaction();

    try {
        // 1. Insert item details into 'items' table
        // CRITICAL FIX HERE: The bind_param string length must match the number of variables exactly.
        // There are 13 variables: 1 int ($user_id) and 12 strings.
        // Check your database schema for 'item_quantity'. If it's an INT, use 'i' for it.
        // Assuming 'item_quantity' is an integer (most likely), let's adjust the bind_param string.
        // If it's VARCHAR in DB, keep it 's'. I'm assuming INT for quantity here.
        $stmt_item = $conn->prepare("INSERT INTO items (user_id, name, description, item_category, item_quantity, item_dimensions, item_condition, item_location, exchange_reason, pickup_options, desired_item, exchange_method, status, created_at, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

        if ($stmt_item === false) {
            throw new Exception("Prepare item statement failed: " . $conn->error);
        }

        // Bind parameters: 'i' for integer user_id, 'i' for itemQuantity, 's' for strings
        // Total types: 1 (user_id) + 1 (itemQuantity) + 11 (other strings) = 13 types.
        // String should be: "iisssssssssss"
        $stmt_item->bind_param(
            "iisssssssssss", // 1 int (user_id), 1 int (itemQuantity), 11 strings
            $user_id,
            $itemName, 
            $itemDescription,
            $itemCategory,
            $itemQuantity,    // Binds to 'item_quantity' as integer
            $itemDimensions,
            $itemCondition,
            $location, 
            $exchangeReason,
            $pickupOptions,
            $desiredItem,
            $exchangeMethod,
            $status
        );

        if (!$stmt_item->execute()) {
            throw new Exception("Execute item statement failed: " . $stmt_item->error);
        }

        $item_id = $conn->insert_id; // Get the ID of the newly inserted item

        // 2. Handle image uploads
        // Make sure '../uploads/' path is correct relative to this script's location
        // If upload_items.php is in backend/api/, then ../uploads/ goes to backend/uploads/
        $uploadDir = '../uploads/'; 
        if (!is_dir($uploadDir)) {
            // Attempt to create the directory if it doesn't exist
            if (!mkdir($uploadDir, 0777, true)) {
                // Log and throw an error if directory creation fails
                error_log("Failed to create upload directory: " . $uploadDir);
                throw new Exception("Failed to create upload directory. Check permissions.");
            }
        }

        $uploadedImages = [];
        // Check if 'images' array exists and if any file was actually uploaded (not just empty input)
        if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && !empty($_FILES['images']['name'][0])) {
            $totalFiles = count($_FILES['images']['name']);
            for ($i = 0; $i < $totalFiles; $i++) {
                $fileName = $_FILES['images']['name'][$i];
                $fileTmpName = $_FILES['images']['tmp_name'][$i];
                $fileSize = $_FILES['images']['size'][$i];
                $fileError = $_FILES['images']['error'][$i];
                
                $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $allowed = array('jpg', 'jpeg', 'png', 'gif');

                if (in_array($fileExt, $allowed)) {
                    if ($fileError === 0) {
                        if ($fileSize < 5000000) { // 5MB max
                            $fileNameNew = uniqid('img_', true) . "." . $fileExt; 
                            $fileDestination = $uploadDir . $fileNameNew;

                            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                                $uploadedImages[] = $fileNameNew; // Store just the filename for DB
                            } else {
                                error_log("Failed to move uploaded file: " . $fileTmpName . " to " . $fileDestination . " for item_id: " . $item_id);
                                $response['image_messages'][] = "Failed to move image '{$fileName}'.";
                            }
                        } else {
                            $response['image_messages'][] = "Image '{$fileName}' is too large (> 5MB).";
                        }
                    } else {
                        $response['image_messages'][] = "Error uploading image '{$fileName}': Code {$fileError}.";
                    }
                } else {
                    $response['image_messages'][] = "Invalid file type for '{$fileName}'. Only JPG, JPEG, PNG, GIF allowed.";
                }
            }
        } else {
            // This means no files were uploaded or the $_FILES array structure was unexpected
            $response['image_messages'][] = "No images were provided or an upload error occurred.";
        }

        // 3. Insert image paths into 'item_images' table
        if (!empty($uploadedImages)) {
            $stmt_image = $conn->prepare("INSERT INTO item_images (item_id, image_path) VALUES (?, ?)");
            if ($stmt_image === false) {
                throw new Exception("Prepare image statement failed: " . $conn->error);
            }
            foreach ($uploadedImages as $imagePath) {
                $stmt_image->bind_param("is", $item_id, $imagePath);
                if (!$stmt_image->execute()) {
                    error_log("Failed to insert image path: {$imagePath} for item_id: {$item_id}: " . $stmt_image->error);
                    $response['image_messages'][] = "Failed to record image '{$imagePath}' in database.";
                }
            }
            $stmt_image->close();
        } else {
            // Only add this if no images were intended or uploaded successfully
            if (empty($response['image_messages'])) { // Prevent double messages
                $response['image_messages'][] = "No images successfully processed for storage.";
            }
        }

        $conn->commit();
        $response["status"] = "success";
        $response["message"] = "Item uploaded successfully!";
        $response["item_id"] = $item_id;

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500); // Internal Server Error
        $response = array("status" => "error", "message" => "Failed to upload item: " . $e->getMessage());
    } finally {
        if (isset($stmt_item) && $stmt_item instanceof mysqli_stmt) {
            $stmt_item->close();
        }
        // $stmt_image is closed inside the try block if successful, no need here.
    }

} else {
    http_response_code(405); // Method Not Allowed
    $response = array("status" => "error", "message" => "Invalid request method. Only POST is allowed.");
}

// Close connection at the very end of the script
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

// Flush the output buffer and send the JSON response
ob_end_flush();
echo json_encode($response);
?>