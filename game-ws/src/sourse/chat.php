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
    error_log("🔵 handleChatFriends llamado");
    error_log("🔵 Body recibido: " . json_encode($body));
    
    // Soportar tanto sender_id/receiver_id como userId/receiverId
    $senderId = $body['sender_id'] ?? $body['userId'] ?? null;
    $receiverId = $body['receiver_id'] ?? $body['receiverId'] ?? null;
    $message = $body['message'] ?? null;
    
    error_log("🔵 SenderId: $senderId, ReceiverId: $receiverId, Message: $message");
    
    if (!$senderId || !$receiverId || !$message) {
        error_log("❌ Chat: Missing required fields. senderId=$senderId, receiverId=$receiverId");
        return;
    }
    
    // Verificar que sean amigos
    $url = 'http://localhost:8085/api/friends?id=' . $senderId;
    error_log("🔵 Verificando amistad en: $url");
    
    $friendList = $webSocket->apiRest->get($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $conn->authToken,
                'Accept' => 'application/json'
            ]
        ])->getBody()->getContents();
    
    error_log("🔵 Friend list response: $friendList");
    
    $isFriend = searchInFriendList($friendList, $receiverId);
    error_log("🔵 Are friends? " . ($isFriend ? "YES" : "NO"));
    
    if ($isFriend) {
        error_log("🔵 Verificando si receiver $receiverId está conectado...");
        error_log("🔵 Usuarios conectados: " . json_encode(array_keys($webSocket->usersConns)));
        
        if (isset($webSocket->usersConns[$receiverId])) {
            $receiverConnection = $webSocket->usersConns[$receiverId];
            $msg = [
                'type' => 'chat-friends',
                'senderId' => $senderId,
                'receiverId' => $receiverId,
                'message' => $message,
                'timestamp' => time()
            ];
            error_log("✅ Enviando mensaje: " . json_encode($msg));
            $receiverConnection->send(json_encode($msg));
            error_log("✅ Chat: Message sent from $senderId to $receiverId");
        } else {
            error_log("❌ Chat: Receiver $receiverId is not connected");
        }
    } else {
        error_log("❌ Chat: Users $senderId and $receiverId are not friends");
    }
}

function searchInFriendList($friendListRaw, $receiverId) {
    $friendList = json_decode($friendListRaw, true);
    if (!isset($friendList['success']))
        return false;
    foreach ($friendList['success'] as $friend) {
        if ((int)$friend['user_id'] === (int)$receiverId)
            return true;
    }
    return false;
}

?>