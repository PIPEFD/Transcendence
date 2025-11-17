<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/chat.php';
require_once __DIR__ . '/game.php';
require_once __DIR__ . '/auth.php';

class webSocket implements \Ratchet\MessageComponentInterface {
    protected $client;
    protected $apiRest;
    protected $usersConns = []; // as client but in map :D
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
    }
    public function onMessage(\Ratchet\ConnectionInterface $conn, $data) {
        $body = json_decode($data, true);
        if (!$conn->auth && $data['type'] !== 'auth') {
            $conn->send(json_encode(['unauthorized']));
            return ;
        }
        switch ($data['type'] ?? '') {
            case 'auth':
                handleAuth($this, $conn, $body);
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