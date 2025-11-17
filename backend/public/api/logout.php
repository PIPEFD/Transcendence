<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$user_id = $body['user_id'];

if ($requestMethod != 'POST')
	errorSend(405, 'Method Not Allowed');

// ahora logOut necesita USER_ID en el body para setear el status en off. 
doQuery($database, "UPDATE users SET is_online = 0 WHERE user_id = :id", [':id', $user_id, SQLITE3_INTEGER]);
successSend('Logged out successfully');
exit;

?>
