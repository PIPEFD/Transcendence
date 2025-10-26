<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // permite cualquier origen
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/header.php';
require_once __DIR__ . '/../../vendor/autoload.php';
if (!function_exists('connectDatabase')) {
    function connectDatabase(): SQLite3 {
        $dbPath = __DIR__ . '/../../database.db'; // Ajusta según tu proyecto
        if (!file_exists($dbPath)) {
            die(json_encode(['success' => false, 'error' => 'Database file not found']));
        }
        return new SQLite3($dbPath);
    }
}


// Ahora puedes usar la base de datos
$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

// Función para enviar errores en JSON (solo si no existe en header.php)
if (!function_exists('errorSend')) {
    function errorSend(int $code, string $message): void {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
        exit;
    }
}

// Validaciones básicas
if ($requestMethod != 'POST') {
    errorSend(405, 'unauthorized method');
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
    errorSend(415, 'unsupported media type');
}
if (!is_array($body)) {
    errorSend(400, 'invalid json');
}
if (!isset($body['id'])) {
    errorSend(400, 'Missing field: id');
}

$user_id = intval($body['id']);

// Preparar la consulta de forma segura
$stmt = @$database->prepare('SELECT avatar_url FROM users WHERE user_id = :user_id');
if (!$stmt) {
    errorSend(500, "SQLite Error: " . $database->lastErrorMsg());
}

@$stmt->bindValue(':user_id', $user_id, SQLITE3_INTEGER);

$result = @$stmt->execute();
if (!$result) {
    errorSend(500, "SQLite Error: " . $database->lastErrorMsg());
}

$row = @$result->fetchArray(SQLITE3_ASSOC);
if (!$row) {
    errorSend(404, 'User not found');
}

// Devolver avatar_url usando la función successSend() de header.php
$avatar_url = $row['avatar_url'] ?? null;
successSend([
    'user_id' => $user_id,
    'avatar_url' => $avatar_url
]);

?>
