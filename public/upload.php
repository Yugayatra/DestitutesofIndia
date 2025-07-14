<?php
header('Content-Type: application/json');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = __DIR__ . '/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
            $ext = 'jpg'; // default to jpg if extension is not allowed
        }
        $fileName = uniqid('img_', true) . '.' . $ext;
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
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
            file_put_contents($postsFile, json_encode($posts, JSON_PRETTY_PRINT));

            $response['status'] = 'success';
            $response['imageUrl'] = 'uploads/' . $fileName;
            $response['latitude'] = $latitude;
            $response['longitude'] = $longitude;
            $response['address'] = $address;
            $response['timestamp'] = $timestamp;
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to move uploaded file.';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No image uploaded or upload error.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response); 