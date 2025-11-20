<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod !== 'GET') {
    errorSend(405, 'Method not allowed');
}

$userId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($userId <= 0) {
    errorSend(400, 'User ID required');
}

// Obtener información del usuario
$sqlQuery = "SELECT user_id, username, avatar_url FROM users WHERE user_id = :user_id";
$bind = [':user_id', $userId, SQLITE3_INTEGER];

$res = doQuery($database, $sqlQuery, $bind);
if (!$res) {
    errorSend(500, "Sql error: " . $database->lastErrorMsg());
}

$row = $res->fetchArray(SQLITE3_ASSOC);

if (!$row) {
    errorSend(404, 'User not found');
}

successSend([
    'user_id' => (int)$row['user_id'],
    'username' => $row['username'],
    'avatar_url' => $row['avatar_url'] ?? '/assets/avatar1.png'
]);

?>
