<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Debug - Destitutes of India</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .debug-section {
            background: white;
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .file-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .file-item img {
            max-width: 100px;
            max-height: 100px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .status-ok { color: green; }
        .status-error { color: red; }
        .status-warning { color: orange; }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>Image Debug Tool</h1>
    
    <div class="debug-section">
        <h2>1. Uploads Directory Status</h2>
        <?php
        $uploadDir = __DIR__ . '/uploads/';
        echo "<p><strong>Upload Directory:</strong> $uploadDir</p>";
        echo "<p><strong>Directory Exists:</strong> " . (file_exists($uploadDir) ? '✅ Yes' : '❌ No') . "</p>";
        echo "<p><strong>Directory Writable:</strong> " . (is_writable($uploadDir) ? '✅ Yes' : '❌ No') . "</p>";
        echo "<p><strong>Directory Permissions:</strong> " . substr(sprintf('%o', fileperms($uploadDir)), -4) . "</p>";
        ?>
    </div>

    <div class="debug-section">
        <h2>2. Uploaded Files</h2>
        <?php
        if (file_exists($uploadDir)) {
            $files = scandir($uploadDir);
            $imageFiles = array_filter($files, function($file) {
                return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif']);
            });
            
            if (empty($imageFiles)) {
                echo "<p class='status-warning'>No image files found in uploads directory.</p>";
            } else {
                echo "<p>Found " . count($imageFiles) . " image files:</p>";
                foreach ($imageFiles as $file) {
                    $filePath = $uploadDir . $file;
                    $webPath = '/uploads/' . $file;
                    $fileSize = filesize($filePath);
                    $filePerms = substr(sprintf('%o', fileperms($filePath)), -4);
                    
                    echo "<div class='file-item'>";
                    echo "<img src='$webPath' alt='$file' onerror='this.style.display=\"none\"'>";
                    echo "<div>";
                    echo "<strong>$file</strong><br>";
                    echo "Size: " . number_format($fileSize) . " bytes<br>";
                    echo "Permissions: $filePerms<br>";
                    echo "Web Path: <code>$webPath</code><br>";
                    echo "Status: " . (file_exists($filePath) ? '<span class="status-ok">✅ File exists</span>' : '<span class="status-error">❌ File missing</span>');
                    echo "</div>";
                    echo "</div>";
                }
            }
        } else {
            echo "<p class='status-error'>Uploads directory does not exist!</p>";
        }
        ?>
    </div>

    <div class="debug-section">
        <h2>3. Posts.json Status</h2>
        <?php
        $postsFile = __DIR__ . '/posts.json';
        echo "<p><strong>Posts File:</strong> $postsFile</p>";
        echo "<p><strong>File Exists:</strong> " . (file_exists($postsFile) ? '✅ Yes' : '❌ No') . "</p>";
        
        if (file_exists($postsFile)) {
            $fileSize = filesize($postsFile);
            echo "<p><strong>File Size:</strong> " . number_format($fileSize) . " bytes</p>";
            
            $json = file_get_contents($postsFile);
            $posts = json_decode($json, true);
            
            if ($posts === null) {
                echo "<p class='status-error'>❌ Invalid JSON in posts.json</p>";
                echo "<pre>" . htmlspecialchars($json) . "</pre>";
            } else {
                echo "<p class='status-ok'>✅ Valid JSON with " . count($posts) . " posts</p>";
                echo "<pre>" . htmlspecialchars(json_encode($posts, JSON_PRETTY_PRINT)) . "</pre>";
            }
        } else {
            echo "<p class='status-warning'>⚠️ posts.json does not exist yet. It will be created when you upload your first image.</p>";
        }
        ?>
    </div>

    <div class="debug-section">
        <h2>4. Server Information</h2>
        <?php
        echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
        echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
        echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
        echo "<p><strong>Current Script:</strong> " . __FILE__ . "</p>";
        echo "<p><strong>Upload Max Filesize:</strong> " . ini_get('upload_max_filesize') . "</p>";
        echo "<p><strong>Post Max Size:</strong> " . ini_get('post_max_size') . "</p>";
        ?>
    </div>

    <div class="debug-section">
        <h2>5. Test Image Upload</h2>
        <form action="upload.php" method="post" enctype="multipart/form-data">
            <p>Select a test image to upload:</p>
            <input type="file" name="image" accept="image/*" required>
            <input type="hidden" name="latitude" value="28.7041">
            <input type="hidden" name="longitude" value="77.1025">
            <input type="hidden" name="address" value="Test Location">
            <br><br>
            <button type="submit">Upload Test Image</button>
        </form>
    </div>

    <script>
        // Test image loading
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('load', function() {
                    this.parentElement.querySelector('.status-ok')?.textContent = '✅ Loaded successfully';
                });
                img.addEventListener('error', function() {
                    this.parentElement.querySelector('.status-error')?.textContent = '❌ Failed to load';
                });
            });
        });
    </script>
</body>
</html> 