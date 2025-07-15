<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = __DIR__ . '/uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            $response['status'] = 'error';
            $response['message'] = 'Failed to create uploads directory.';
            echo json_encode($response);
            exit;
        }
    }

    // Ensure upload directory is writable
    if (!is_writable($uploadDir)) {
        if (!chmod($uploadDir, 0777)) {
            $response['status'] = 'error';
            $response['message'] = 'Uploads directory is not writable.';
            echo json_encode($response);
            exit;
        }
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $originalName = $_FILES['image']['name'];
        $fileSize = $_FILES['image']['size'];
        
        // Validate file type
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($ext, $allowedExtensions)) {
            $response['status'] = 'error';
            $response['message'] = 'Invalid file type. Only JPG, PNG, and GIF are allowed.';
            echo json_encode($response);
            exit;
        }
        
        // Validate file size (5MB limit)
        if ($fileSize > 5 * 1024 * 1024) {
            $response['status'] = 'error';
            $response['message'] = 'File too large. Maximum size is 5MB.';
            echo json_encode($response);
            exit;
        }
        
        $fileName = uniqid('img_', true) . '.' . $ext;
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            // Ensure the uploaded file is readable
            chmod($destPath, 0644);
            
            $latitude = isset($_POST['latitude']) ? $_POST['latitude'] : '';
            $longitude = isset($_POST['longitude']) ? $_POST['longitude'] : '';
            $address = isset($_POST['address']) ? $_POST['address'] : '';
            $timestamp = date('Y-m-d H:i:s');

            // Save post info to posts.json
            $postInfo = [
                'imageUrl' => 'uploads/' . $fileName,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'address' => $address,
                'timestamp' => $timestamp
            ];
            
            $postsFile = __DIR__ . '/posts.json';
            $posts = [];
            
            if (file_exists($postsFile)) {
                $json = file_get_contents($postsFile);
                $posts = json_decode($json, true) ?: [];
            }
            
            $posts[] = $postInfo;
            
            if (file_put_contents($postsFile, json_encode($posts, JSON_PRETTY_PRINT))) {
                $response['status'] = 'success';
                $response['imageUrl'] = 'uploads/' . $fileName;
                $response['latitude'] = $latitude;
                $response['longitude'] = $longitude;
                $response['address'] = $address;
                $response['timestamp'] = $timestamp;
                $response['debug'] = [
                    'file_exists' => file_exists($destPath),
                    'file_size' => filesize($destPath),
                    'file_permissions' => substr(sprintf('%o', fileperms($destPath)), -4),
                    'original_name' => $originalName,
                    'uploaded_size' => $fileSize
                ];
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Failed to save post information.';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to move uploaded file.';
            $response['debug'] = [
                'tmp_exists' => file_exists($fileTmpPath),
                'dest_writable' => is_writable($uploadDir),
                'upload_error' => $_FILES['image']['error'],
                'php_upload_errors' => [
                    UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
                    UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
                    UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                    UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                    UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                    UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                    UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
                ]
            ];
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No image uploaded or upload error.';
        $response['debug'] = [
            'files_set' => isset($_FILES['image']),
            'upload_error' => isset($_FILES['image']) ? $_FILES['image']['error'] : 'no_file',
            'post_data' => $_POST
        ];
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response); 