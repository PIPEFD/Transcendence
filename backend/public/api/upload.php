<?php

require_once '../config/config.php';
require_once 'header.php';

$database = connectDatabase();
$uploadsPath = __DIR__ . '/uploads/';

if (!isset($_FILES['avatar']) || !isset($_POST['userId']) || $_REQUEST['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['error' => 'bad petition']);
    exit ;
}

if (!checkJWT($_POST['userId'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit ;
}

if (!file_exists($uploadsPath)) {
    mkdir($uploadsPath, 0777, true);
}

$userId = intval($_POST['userId']);
$file = $_FILES['avatar'];
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowed)){
    http_response_code(415);
    echo json_encode(['error' => 'unsupported format']);
    exit ;
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $userId . '.' . $ext;
$dst = $uploadsPath . $filename;

if (!move_uploaded_file($file['temp'], $dst)) {
    http_response_code(500);
    echo json_encode(['error' => 'failed to upload file']);
    exit ;
}

$dir = '/uploads/' . $filename;

$query = $database->prepare('UPDATE users SET avatar_url = :avatar WHERE id = :id');
$query->bindParam(':avatar', $dir);
$query->bindParam(':id', $userId);
if ($query->execute()) {
    echo json_encode(['success' => true, 'avatar_url' => $dir]);
} else {
    http_response_code(500);
    echo json_encode('database error');
}

/* la peticion tiene que ser de tipo POST con el 
archivo con formato avatar: x y
el user id con formato userId: x */

?>