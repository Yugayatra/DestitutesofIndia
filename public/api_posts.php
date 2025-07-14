<?php
header('Content-Type: application/json');
$postsFile = __DIR__ . '/posts.json';

if (file_exists($postsFile)) {
    $json = file_get_contents($postsFile);
    echo $json;
} else {
    echo json_encode([]);
} 