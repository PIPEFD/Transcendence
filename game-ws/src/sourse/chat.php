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
    $url = 'http://localhost:8085/api/friends?id=' . $body['sender_id'];
    $friendList = $webSocket->httpClient->get($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $conn->authToken,
                'Accept' => 'application/json'
            ]
        ])->getBody()->getContents();
    $isFriend = searchInFriendList($friendList, $body);
    if ($isFriend) {
        $receiverId = $body['receiver_id'] ?? null;
        if (isset($webSocket->usersConns[$receiverId])) {
            $receiverConnection = $webSocket->usersConns[$receiverId];
            $msg = [
                'type' => 'chat',
                'from' => $body['sender_id'],
                'to'   => $receiverId,
                'text' => $body['message'],
                'time' => time()
            ];
            $receiverConnection->send(json_encode($msg));
        }
    }
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