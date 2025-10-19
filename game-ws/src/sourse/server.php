<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/webSocket.php';

$port = 9001; // ingeniero de sistemas

$server = \Ratchet\Server\IoServer::factory(new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(new webSocket())), $port, "0.0.0.0");

$server->run();

echo "webSocker CLI activao!" . $port . "\n";

?>