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
    $sqlQuery = "
		SELECT u.user_id, u.username, u.email
		FROM users u
		WHERE u.user_id IN (
			SELECT f.friend_id FROM friends f WHERE f.user_id = :id
			UNION
			SELECT f.user_id FROM friends f WHERE f.friend_id = :id
		)
	";

    $bind = [':id', $queryId, SQLITE3_INTEGER];
    $res = doQuery($database, $sqlQuery, $bind);
    if (!$res) errorSend(500, "Sql error: " . $database->lastErrorMsg());

    $content = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $content[] = $row;
    }

    successSend($content);
    exit;
}




function deleteFriend(SQLite3 $database, array $body, int $user_id): void
{
    if (!checkBodyData($body, 'friend_id'))
        errorSend(400, 'bad request');
    $friend_id = (int)$body['friend_id'];

    $sqlQuery = "
        DELETE FROM friends
        WHERE (user_id = :user_id AND friend_id = :friend_id)
           OR (user_id = :friend_id AND friend_id = :user_id)
    ";

    $stmt = $database->prepare($sqlQuery);
    $stmt->bindValue(':user_id', $user_id, SQLITE3_INTEGER);
    $stmt->bindValue(':friend_id', $friend_id, SQLITE3_INTEGER);
    $res = $stmt->execute();
    if (!$res) {
        error_log("deleteFriend execute error: " . $database->lastErrorMsg());
        errorSend(500, "Sql error: " . $database->lastErrorMsg());
    }

    // Comprueba cambios:
    $changes = $database->changes();
    error_log("deleteFriend - changes: $changes");
    if ($changes === 0)
        errorSend(404, 'friend not found');

    successSend('friend deleted');
}



?>