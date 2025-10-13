<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$queryId = $_GET['id'] ?? null;
error_log(print_r($queryId, true));
switch ($requestMethod) 
{
	case 'GET':
		if (!checkJWT($queryId))
			errorSend(403, 'forbidden access');
		getFriendList($database, $queryId);
		break;
	case 'POST':
		if (!checkBodyData($body, 'user_id'))
			errorSend(400, 'bad request');
		$user_id = $body['user_id'];
		if (!checkJWT($user_id))
			errorSend(403, 'forbidden access');
		deleteFriend($database, $body, $user_id);
		break;
	default:
		errorSend(405, 'unauthorized method');
}

function getFriendList(SQLite3 $database, int $queryId): void 
{
	$sqlQuery = "SELECT id, username, email FROM users WHERE id IN
	(SELECT friend_id FROM friends WHERE id = :id)";
	$bind1 = [':id', $queryId, SQLITE3_INTEGER];
	$res = doQuery($database, $sqlQuery, $bind1);
	if (!$res)
	errorSend(500, "Sql error: " . $database->lastErrorMsg());
	$content = [];
	while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
		if (!$row == 0)
		break ;
	$content[] = $row;
	}
	successSend($content); // si no hay coincidencias devolver un array vacío es el comportamiento esperado
	exit ;
}

function deleteFriend(SQLite3 $database, array $body, int $user_id): void
{
	if (!checkBodyData($body, 'friend_id'))
		errorSend(400, 'bad request');
	$friend_id = $body['friend_id'];

	$sqlQuery = "DELETE FROM friends WHERE id = :id AND friend_id = :friend_id OR
	user_id = :friend_id AND friend_id = :user_id";
	$bind1 = [':user_id', $user_id, SQLITE3_INTEGER];
	$bind2 = [':friend_id', $friend_id, SQLITE3_INTEGER];
	$res = doQuery($database, $sqlQuery, $bind1, $bind2);
	if (!$res)
		errorSend(500, "Sql error: " . $database->lastErrorMsg());
	if (!$database->changes() === 0)
		errorSend(404, 'friend not found');
	successSend('friend deleted');
}

?>