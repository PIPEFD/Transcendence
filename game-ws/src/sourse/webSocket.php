<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/chat.php';
require_once __DIR__ . '/game.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/status.php';

class webSocket implements \Ratchet\MessageComponentInterface {
    public $client; // public para acceso desde funciones externas
    public $apiRest; // cambiado a public para acceso desde chat.php
    public $usersConns = []; // as client but in map :D (public para acceso desde funciones externas)
    public function __construct() {
        $this->client = new \SplObjectStorage;
        $this->apiRest = new \GuzzleHttp\Client([
            'base_uri' => 'http://localhost:8085/api', // url api
            'timeout' => 5.0,
        ]);
    }
    public function onOpen(\Ratchet\ConnectionInterface $conn) {
        $conn->auth = false;
        $conn->authToken = null;
        $conn->userId = null;
        $conn->userName = null;
        $conn->currentGameId = null;
        $this->client->attach($conn);
        $conn->send(json_encode(['type' => 'welcome', 'message' => 'Connected to Transcendence WebSocket Server']));
    }
    public function onMessage(\Ratchet\ConnectionInterface $conn, $data) {
        $body = json_decode($data, true);
        if (!$conn->auth && ($body['type'] ?? '') !== 'auth') {
            $conn->send(json_encode(['unauthorized']));
            return ;
        }
        switch ($body['type'] ?? '') {
            case 'ping':
                $conn->send(json_encode(['type' => 'pong', 'timestamp' => time()]));
                break ;
            case 'auth':
                handleAuth($this, $conn, $body);
                break ;
            case 'get-online-users':
                handleGetOnlineUsers($this, $conn);
                break ;
            case 'set-status':
                handleSetStatus($this, $conn, $body);
                break ;
            case 'chat-friends':
                handleChatFriends($this, $conn, $body);
                break ;
            case 'chat-global':
                handleChatGlobal($this, $conn, $body);
                break ;
            case 'game':
                handleNewGame($this, $conn, $body);
                break ;
            default:
                $conn->send(json_encode(['type' => '400', 'message' => 'bad request']));
                break ;
        }
    }
    public function onError(\Ratchet\ConnectionInterface $conn, \Exception $exc) {
        $conn->send(json_encode(['type' => '500', 'message' => 'web socket connection error.']));
        $conn->close();
    }
    public function onClose(\Ratchet\ConnectionInterface $conn) {
        // Notificar a todos que el usuario se desconectó
        if (isset($conn->userId) && isset($conn->userName)) {
            broadcastUserStatus($this, $conn->userId, $conn->userName, 'offline');
        }
        
        // mandar peticion de logOut
        $this->client->detach($conn);
        if (isset($conn->userId))
            unset($this->usersConns[$conn->userId]);
    }
}

// { "type": "auth", "token": "$token", "id": "$userId" }

// { "type": "chat-friends", "userId": "$idEnviador", "receiverId": "$idRecibidor", "message": "$mensaje" }

// { "type": "chat-global", "userId": "$idUsuario", "message": "mensahe" }

// { "type": "game", "player1": "$idPlayer1", "player2": "$idPlayer2" }

?>