<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$postsFile = __DIR__ . '/posts.json';

if (file_exists($postsFile)) {
    $json = file_get_contents($postsFile);
    $posts = json_decode($json, true);
    
    if ($posts === null) {
        // JSON is invalid, return empty array
        echo json_encode([]);
    } else {
        echo $json;
    }
} else {
    // File doesn't exist yet, return empty array
    echo json_encode([]);
} 