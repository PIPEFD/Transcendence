<?php

require_once __DIR__ . '/../../vendor/autoload.php';

function handleChatGlobal($webSocket, $conn, $body) {
    $message = $body['message'] ?? null;
    if (!$message)
        return ;
    foreach ($webSocket->client as $client) {
        if ($client !== $conn && $client->auth) {
            $client->send(json_encode([
                'type'    => 'chat-global',
                'from'    => $conn->userName, // aqui podria poner el username
                'message' => $message
            ]));
        }
    }
}

function handleChatFriends($webSocket, $conn, $body) {
    // Soportar tanto userId/receiverId como sender_id/receiver_id
    $senderId = $body['sender_id'] ?? $body['userId'] ?? $conn->userId;
    $receiverId = $body['receiver_id'] ?? $body['receiverId'] ?? null;
    $message = $body['message'] ?? null;
    
    if (!$receiverId || !$message) {
        error_log('Missing receiver_id or message');
        $conn->send(json_encode(['type' => 'error', 'message' => 'Missing receiver_id or message']));
        return;
    }
    
    // Verificar que el receiver está conectado
    if (!isset($webSocket->usersConns[$receiverId])) {
        error_log("Receiver $receiverId not connected");
        $conn->send(json_encode(['type' => 'error', 'message' => 'Receiver not connected']));
        return;
    }
    
    $receiverConnection = $webSocket->usersConns[$receiverId];
    $msg = [
        'type' => 'chat',
        'from' => $senderId,
        'fromUsername' => $conn->userName,
        'to'   => $receiverId,
        'text' => $message,
        'time' => time()
    ];
    
    // Enviar al receptor
    $receiverConnection->send(json_encode($msg));
    
    // Confirmar al emisor
    $conn->send(json_encode([
        'type' => 'chat-sent',
        'to' => $receiverId,
        'text' => $message,
        'time' => time()
    ]));
}

function searchInFriendList($friendListRaw, $body) {
    $receiverId = $body['receiver_id'];
    $friendList = json_decode($friendListRaw, true);
    if (!isset($friendList['success']))
        return false;
    foreach ($friendList['success'] as $friend) {
        if ((int)$friend === $receiverId)
            return true;
    }
    return false;
}

?>