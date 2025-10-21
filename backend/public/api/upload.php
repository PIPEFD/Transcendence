<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once 'header.php';

$database = connectDatabase();
$uploadsPath = __DIR__ . '/uploads/';
$body = json_decode(file_get_contents('php://input'), true);
error_log(print_r($body['user_id']));
if (!checkJWT($body['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit ;
}

if (!isset($_FILES['avatar']) || !isset($body['user_id']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['error' => 'bad petition']);
    exit ;
}

if (!file_exists($uploadsPath)) {
    mkdir($uploadsPath, 0777, true);
}

$userId = intval($body['user_id']);
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

if (!move_uploaded_file($file['tmp_name'], $dst)) {
    http_response_code(500);
    echo json_encode(['error' => 'failed to upload file']);
    exit ;
}

$dir = '/uploads/' . $filename;
error_log("hola4");

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
