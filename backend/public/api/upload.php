<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once 'header.php';

// Conectar a la base de datos
$database = connectDatabase();
$uploadsPath = __DIR__ . '/uploads/';

// Obtener user_id desde FormData
$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
error_log("User ID received: " . $userId);

// Validar userId y JWT
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
error_log("Authorization header: " . $authHeader);

if (!$userId || !checkJWT($userId)) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

// Validar que haya un archivo y que sea POST
if (!isset($_FILES['avatar']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['error' => 'bad request']);
    exit;
}

// Crear carpeta uploads si no existe
if (!file_exists($uploadsPath)) {
    mkdir($uploadsPath, 0777, true);
}

// Obtener el archivo y validar tipo
$file = $_FILES['avatar'];
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowed)) {
    http_response_code(415);
    echo json_encode(['error' => 'unsupported format']);
    exit;
}

// Preparar nombre y mover archivo
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $userId . '.' . $ext;
$dst = $uploadsPath . $filename;

if (!move_uploaded_file($file['tmp_name'], $dst)) {
    http_response_code(500);
    echo json_encode(['error' => 'failed to upload file']);
    exit;
}

$dir = '/uploads/' . $filename;
error_log("File uploaded to: " . $dir);

// Actualizar la base de datos usando la columna correcta
$query = $database->prepare('UPDATE users SET avatar_url = :avatar WHERE user_id = :id');
$query->bindParam(':avatar', $dir);
$query->bindParam(':id', $userId);

if ($query->execute()) {
    echo json_encode(['success' => true, 'avatar_url' => $dir]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'database error']);
}
?>
