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
        $url = 'http://localhost:8085/api?id='. $conn->userId;
        $res = $webSocket->httpClient->get($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $conn->authToken,
                'Accept' => 'application/json'
            ]
        ]);
        $responseBody = json_decode((string)$res->getBody(), true);
        $conn->auth = true;
        $conn->userName = $responseBody['username'] ?? null;
        $webSocket->usersConns[$conn->userId] = $conn;
        $conn->send(json_encode(['type' => 'auth-ok']));
    } catch (\Exception $e) {
        $conn->send(json_encode(['type' => 'auth-failed', 'reason' => 'invalid token']));
        $conn->close();
    }
}

?>