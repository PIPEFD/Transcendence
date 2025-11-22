<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod !== 'POST')
    errorSend(405, 'unauthorized method');

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body))
    errorSend(400, 'invalid json');

if (!checkBodyData($body, 'id'))
    errorSend(400, 'Bad request. Missing user id');

$user_id = $body['id'];

// Verificar JWT
if (!checkJWT($user_id))
    errorSend(403, 'forbidden access');

// Buscar avatar del usuario
$sqlQuery = "SELECT avatar FROM users WHERE user_id = :user_id";
$bind = [':user_id', $user_id, SQLITE3_INTEGER];
$result = doQuery($database, $sqlQuery, $bind);

if (!$result)
    errorSend(500, "SQLite Error: " . $database->lastErrorMsg());

$row = $result->fetchArray(SQLITE3_ASSOC);

if (!$row)
    errorSend(404, 'User not found');

// Si tiene avatar, devolverlo
if ($row['avatar']) {
    // Si es una URL completa (empieza con http/uploads), devolverla directamente
    if (strpos($row['avatar'], 'http') === 0 || strpos($row['avatar'], 'uploads/') === 0) {
        successSend(['avatar_url' => $row['avatar']], 200);
    } else {
        // Si es un ID de avatar por defecto
        successSend(['avatar_url' => "/assets/avatar_{$row['avatar']}.png"], 200);
    }
} else {
    // No tiene avatar
    successSend(['avatar_url' => null], 200);
}

/*
    Endpoint para obtener la URL del avatar de un usuario
    GET /api/avatar_photo.php
    Body: { "id": user_id }
    Response: { "success": { "avatar_url": "..." } }
*/

?>
