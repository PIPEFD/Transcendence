<?php

require_once __DIR__ . '/../../vendor/autoload.php';

function handleAuth($webSocket, $conn, $body) {
    $conn->authToken = $body['token'] ?? null;
    if (!$conn->authToken) {
        $conn->send(json_encode(['type'=>'auth-failed','reason'=>'missing token']));
        $conn->close();
        return;
    }
    try {
        $conn->userId = $body['id'] ?? 0;
        
        // TODO: Validar token contra la API real
        // Por ahora, aceptamos cualquier token para testing
        $conn->auth = true;
        $conn->userName = 'User' . $conn->userId; // Nombre temporal
        $conn->status = 'online'; // Estados: online, offline, in-game
        $webSocket->usersConns[$conn->userId] = $conn;
        $conn->send(json_encode(['type' => 'auth-ok', 'userId' => $conn->userId, 'username' => $conn->userName]));
        
        // Notificar a todos los usuarios conectados que este usuario está online
        if (function_exists('broadcastUserStatus')) {
            broadcastUserStatus($webSocket, $conn->userId, $conn->userName, 'online');
        }
    } catch (\Exception $e) {
        error_log('Auth error: ' . $e->getMessage());
        $conn->send(json_encode(['type' => 'auth-failed', 'reason' => 'invalid token', 'error' => $e->getMessage()]));
        $conn->close();
    }
}

?>