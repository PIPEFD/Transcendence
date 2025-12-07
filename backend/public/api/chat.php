<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod !== 'GET')
    errorSend(405, 'unauthorized method');

// Verificar autenticación JWT
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (empty($authHeader)) {
    errorSend(403, 'forbidden access - no token');
}

$decodedJWT = getDecodedJWT($authHeader);
if (!$decodedJWT) {
    errorSend(403, 'forbidden access - invalid token');
}

$user_id = $decodedJWT->data->user_id ?? null;
if (!$user_id) {
    errorSend(403, 'forbidden access - no user_id in token');
}

$action = $_GET['action'] ?? null;
$friend_id = $_GET['friend_id'] ?? null;
$limit = $_GET['limit'] ?? 50;

if ($action === 'history') {
    if (!$friend_id) {
        errorSend(400, 'Missing friend_id parameter');
    }
    
    getChatHistory($database, $user_id, $friend_id, $limit);
} else {
    errorSend(400, 'Invalid action parameter');
}

function getChatHistory(SQLite3 $database, int $user_id, int $friend_id, int $limit): void
{
    // Los mensajes de chat se manejan en tiempo real a través del WebSocket
    // No se almacenan en la base de datos (solo existen en memoria)
    // Este endpoint devuelve un array vacío para compatibilidad con el frontend
    
    successSend([], 200);
}

/*
    Endpoint para obtener el historial de chat entre dos usuarios
    GET /api/chat.php?action=history&friend_id=X&limit=Y
    Headers: Authorization: Bearer <JWT>
    Response: Array de mensajes ordenados cronológicamente
*/

?>
