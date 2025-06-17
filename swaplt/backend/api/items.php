<?php
// Essential for API endpoints to prevent HTML errors and enable output buffering
ini_set('display_errors', 0); // Keep at 0 for production, change to 1 for debugging
ini_set('display_startup_errors', 0);
error_reporting(E_ALL); // Still log all errors to the PHP error log
ob_start(); // Start output buffering at the very beginning

require_once 'db_connect.php'; // Your database connection file

header("Access-Control-Allow-Origin: http://localhost:3000"); // Specify your React app's URL
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow POST for item upload
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Exit immediately for OPTIONS requests
}

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // For POST requests with FormData, data is in $_POST and files in $_FILES
    $user_id = $_POST['user_id'] ?? null;
    $itemName = $_POST['itemName'] ?? '';
    $itemDescription = $_POST['itemDescription'] ?? '';
    $itemCategory = $_POST['itemCategory'] ?? '';
    $itemQuantity = $_POST['itemQuantity'] ?? '1'; // Default to '1' if not set
    $itemDimensions = $_POST['itemDimensions'] ?? null; // Can be null if empty
    $itemCondition = $_POST['itemCondition'] ?? '';
    $location = $_POST['location'] ?? '';
    $exchangeReason = $_POST['exchangeReason'] ?? null; // Can be null if empty
    // Pickup options comes as an array from React's FormData, implode it
    $pickupOptions = isset($_POST['pickupOptions']) && is_array($_POST['pickupOptions']) ? implode(', ', $_POST['pickupOptions']) : '';
    $desiredItem = $_POST['desiredItem'] ?? null; // Can be null if empty
    $exchangeMethod = $_POST['exchangeMethod'] ?? '';
    $status = 'proposed'; // Set default status to 'proposed' for new uploads

    // Basic validation
    if (empty($user_id) || empty($itemName) || empty($itemDescription) || empty($itemCategory) || empty($itemQuantity) || empty($itemCondition) || empty($location) || empty($exchangeMethod)) {
        http_response_code(400); // Bad Request
        $response = array("status" => "error", "message" => "Missing required fields for item upload.");
        echo json_encode($response);
        ob_end_flush();
        exit();
    }

    $conn->begin_transaction();

    try {
        // 1. Insert item details into 'items' table
        // Use 'name' and 'description' as per our last successful iteration, if that's what your DB uses.
        // Also cast itemQuantity to int if your database column is INT.
        $stmt_item = $conn->prepare("INSERT INTO items (user_id, name, description, item_category, item_quantity, item_dimensions, item_condition, item_location, exchange_reason, pickup_options, desired_item, exchange_method, status, created_at, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

        if ($stmt_item === false) {
            throw new Exception("Prepare item statement failed: " . $conn->error);
        }

        // Bind parameters: 'i' for integer user_id, 'i' for itemQuantity, 's' for strings
        // Adjust the type string based on your actual database schema for item_quantity
        // If item_quantity is INT: "iissssssssssss" (1 integer, 1 integer, 12 strings)
        // If item_quantity is VARCHAR/TEXT: "isssssssssssss" (1 integer, 13 strings)
        // Assuming item_quantity is INT based on React's min="1"
        $stmt_item->bind_param(
            "iissssssssssss", // 1 int (user_id), 1 int (itemQuantity), 12 strings
            $user_id,
            $itemName,
            $itemDescription,
            $itemCategory,
            (int)$itemQuantity, // Cast to int
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
        $uploadDir = '../uploads/'; // Correct path relative to 'backend/api/'
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Failed to create upload directory: " . $uploadDir);
            }
        }

        $uploadedImages = [];
        // Check if images were uploaded and no critical upload errors
        if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && $_FILES['images']['error'][0] !== UPLOAD_ERR_NO_FILE) {
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
                                $response['image_messages'][] = "Failed to move image '{$fileName}'. Check server permissions.";
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
            // This is for the React validation, if no images were provided.
            // But the PHP script itself doesn't strictly require images, though the UI does.
            $response['image_messages'][] = "No images were provided for upload.";
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
        }

        $conn->commit();
        $response["status"] = "success";
        $response["message"] = "Item uploaded successfully!";
        $response["item_id"] = $item_id;
        http_response_code(201); // Created

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500); // Internal Server Error
        $response = array("status" => "error", "message" => "Failed to upload item: " . $e->getMessage());
        // Log the actual error for debugging
        error_log("Item upload exception: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    } finally {
        if (isset($stmt_item) && $stmt_item instanceof mysqli_stmt) {
            $stmt_item->close();
        }
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // This section is for handling GET requests and fetching items.
    // Your provided GET logic looks okay, but ensure your database columns match 'name'/'description' if your POST uses them.
    // If your items table uses 'item_name' and 'item_description', adjust the GET query as needed.
    $item_id = $_GET['item_id'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    $category_name = $_GET['category'] ?? null;

    // IMPORTANT: Make sure these column names match your DB. If POST uses 'name', 'description', GET should also reflect that.
    $sql = "SELECT i.item_id, i.user_id, i.name, i.description, i.item_category, i.item_quantity, i.item_dimensions, i.item_condition, i.item_location, i.exchange_reason, i.pickup_options, i.desired_item, i.exchange_method, i.status, i.created_at, i.upload_date, GROUP_CONCAT(ii.image_path ORDER BY ii.image_id ASC) AS image_paths
            FROM items i
            LEFT JOIN item_images ii ON i.item_id = ii.item_id";

    $conditions = [];
    $params = [];
    $types = "";

    if ($item_id) {
        $conditions[] = "i.item_id = ?";
        $params[] = $item_id;
        $types .= "i";
    }
    if ($user_id) {
        $conditions[] = "i.user_id = ?";
        $params[] = $user_id;
        $types .= "i";
    }
    if ($category_name) {
        $conditions[] = "i.item_category = ?";
        $params[] = $category_name;
        $types .= "s";
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " GROUP BY i.item_id ORDER BY i.upload_date DESC";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        http_response_code(500);
        $response = ["status" => "error", "message" => "Prepare statement failed for GET: " . $conn->error];
    } else {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $items = [];
            while ($row = $result->fetch_assoc()) {
                $row['image_paths'] = $row['image_paths'] ? explode(',', $row['image_paths']) : [];
                $items[] = $row;
            }
            $response = ["status" => "success", "message" => "Items fetched successfully.", "items" => $items];
        } else {
            http_response_code(500);
            $response = ["status" => "error", "message" => "Error fetching items: " . $stmt->error];
        }
        $stmt->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle PUT requests (expecting JSON body from React for updates)
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input === null) {
        http_response_code(400);
        $response = ["status" => "error", "message" => "Invalid JSON input for PUT request."];
    } else {
        $item_id = $_GET['item_id'] ?? ($input['item_id'] ?? null); // Prioritize URL param, then body
        if (empty($item_id)) {
            http_response_code(400);
            $response = ["status" => "error", "message" => "Item ID is required for update."];
        } else {
            $updateFields = [];
            $updateValues = [];
            $updateTypes = "";

            // NOTE: Use 'name' and 'description' here if that's what your DB uses
            if (isset($input['itemName'])) { $updateFields[] = "name = ?"; $updateValues[] = $input['itemName']; $updateTypes .= "s"; }
            if (isset($input['itemDescription'])) { $updateFields[] = "description = ?"; $updateValues[] = $input['itemDescription']; $updateTypes .= "s"; }
            if (isset($input['itemCategory'])) { $updateFields[] = "item_category = ?"; $updateValues[] = $input['itemCategory']; $updateTypes .= "s"; }
            if (isset($input['itemQuantity'])) { $updateFields[] = "item_quantity = ?"; $updateValues[] = (int)$input['itemQuantity']; $updateTypes .= "i"; } // Cast to int
            if (isset($input['itemDimensions'])) { $updateFields[] = "item_dimensions = ?"; $updateValues[] = $input['itemDimensions']; $updateTypes .= "s"; }
            if (isset($input['itemCondition'])) { $updateFields[] = "item_condition = ?"; $updateValues[] = $input['itemCondition']; $updateTypes .= "s"; }
            if (isset($input['location'])) { $updateFields[] = "item_location = ?"; $updateValues[] = $input['location']; $updateTypes .= "s"; }
            if (isset($input['exchangeReason'])) { $updateFields[] = "exchange_reason = ?"; $updateValues[] = $input['exchangeReason']; $updateTypes .= "s"; }
            if (isset($input['pickupOptions'])) {
                $updateFields[] = "pickup_options = ?";
                $updateValues[] = implode(', ', (array)$input['pickupOptions']);
                $updateTypes .= "s";
            }
            if (isset($input['desiredItem'])) { $updateFields[] = "desired_item = ?"; $updateValues[] = $input['desiredItem']; $updateTypes .= "s"; }
            if (isset($input['exchangeMethod'])) { $updateFields[] = "exchange_method = ?"; $updateValues[] = $input['exchangeMethod']; $updateTypes .= "s"; }
            if (isset($input['status'])) { $updateFields[] = "status = ?"; $updateValues[] = $input['status']; $updateTypes .= "s"; }

            if (empty($updateFields)) {
                http_response_code(400);
                $response = ["status" => "error", "message" => "No fields provided for update."];
            } else {
                $sql = "UPDATE items SET " . implode(', ', $updateFields) . " WHERE item_id = ?";
                $updateValues[] = $item_id; // Add item_id to the end for binding
                $updateTypes .= "i"; // Type for item_id

                $stmt = $conn->prepare($sql);
                if ($stmt === false) {
                    http_response_code(500);
                    $response = ["status" => "error", "message" => "Prepare statement failed for PUT: " . $conn->error];
                } else {
                    $stmt->bind_param($updateTypes, ...$updateValues);
                    if ($stmt->execute()) {
                        $response = ["status" => "success", "message" => "Item updated successfully!", "affected_rows" => $stmt->affected_rows];
                    } else {
                        http_response_code(500);
                        $response = ["status" => "error", "message" => "Error updating item: " . $stmt->error];
                    }
                    $stmt->close();
                }
            }
        }
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Handle DELETE requests (expecting item_id in URL or JSON body)
    $item_id = $_GET['item_id'] ?? null;
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$item_id && isset($input['item_id'])) {
        $item_id = $input['item_id'];
    }

    if (empty($item_id)) {
        http_response_code(400);
        $response = ["status" => "error", "message" => "Item ID is required for deletion."];
    } else {
        $stmt = $conn->prepare("DELETE FROM items WHERE item_id = ?");
        if ($stmt === false) {
            http_response_code(500);
            $response = ["status" => "error", "message" => "Prepare statement failed for DELETE: " . $conn->error];
        } else {
            $stmt->bind_param("i", $item_id);
            if ($stmt->execute()) {
                $response = ["status" => "success", "message" => "Item deleted successfully!", "affected_rows" => $stmt->affected_rows];
            } else {
                http_response_code(500);
                $response = ["status" => "error", "message" => "Error deleting item: " . $stmt->error];
            }
            $stmt->close();
        }
    }
} else {
    http_response_code(405); // Method Not Allowed
    $response = ["status" => "error", "message" => "Method Not Allowed"];
}

// Close connection at the very end of the script
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}

// Flush the output buffer and send the JSON response
ob_end_flush();
echo json_encode($response);
?>