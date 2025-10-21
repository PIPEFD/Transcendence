<?php

require_once __DIR__ . '/header.php';

// Conexión a la base de datos
$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$queryId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Validación de ID
if ($queryId <= 0 && $requestMethod === 'GET') {
    errorSend(400, 'Invalid user id');
}

switch ($requestMethod) 
{
    case 'POST':
        if (!checkBodyData($body, 'sender_id', 'receiver_id')) {
            errorSend(400, 'bad request');
        }
        $sender_id = (int)$body['sender_id'];
        $receiver_id = (int)$body['receiver_id'];

        // if (!checkJWT($sender_id)) errorSend(403, 'forbidden access');
        sendFriendRequest($database, $sender_id, $receiver_id);
        break;

    case 'GET':
        // if (!checkJWT($queryId)) errorSend(403, 'forbidden access');
        requestListId($database, $queryId);
        break;

    case 'PATCH':
        if (!checkBodyData($body, 'sender_id', 'receiver_id', 'action')) {
            errorSend(400, 'bad request');
        }
        $sender_id = (int)$body['sender_id'];
        $receiver_id = (int)$body['receiver_id'];
        $action = $body['action'];

        // if (!checkJWT($receiver_id)) errorSend(403, 'forbidden access');
        acceptDeclineRequest($database, $sender_id, $receiver_id, $action);
        break;

    default:
        errorSend(405, 'unauthorized method');
}

function sendFriendRequest(SQLite3 $database, int $sender_id, int $receiver_id): void
{
    $sqlQuery = "INSERT INTO friend_request (sender_id, receiver_id) VALUES (:sender_id, :receiver_id)";
    $bind1 = [':sender_id', $sender_id, SQLITE3_INTEGER];
    $bind2 = [':receiver_id', $receiver_id, SQLITE3_INTEGER];

    $res = doQuery($database, $sqlQuery, $bind1, $bind2);
    if (!$res) {
        errorSend(500, "Sql error: " . $database->lastErrorMsg());
    }
    successSend(['message' => 'friend request sent']);
}

function requestListId(SQLite3 $database, int $receiver_id): void
{
    $sqlQuery = "SELECT sender_id, created_at FROM friend_request WHERE receiver_id = :receiver_id";
    $bind = [':receiver_id', $receiver_id, SQLITE3_INTEGER];

    $res = doQuery($database, $sqlQuery, $bind);
    if (!$res) {
        errorSend(500, "Sql error: " . $database->lastErrorMsg());
    }

    $content = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
        $content[] = $row;
    }

    successSend($content); // <-- solo array, sin JSON_PRETTY_PRINT
}

function acceptDeclineRequest(SQLite3 $database, int $sender_id, int $receiver_id, string $action): void
{
    $sqlQuery = "SELECT * FROM friend_request WHERE sender_id = :sender_id AND receiver_id = :receiver_id";
    $bind1 = [':sender_id', $sender_id, SQLITE3_INTEGER];
    $bind2 = [':receiver_id', $receiver_id, SQLITE3_INTEGER];

    $res = doQuery($database, $sqlQuery, $bind1, $bind2);
    if (!$res) errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

    if (!$res->fetchArray(SQLITE3_ASSOC)) {
        errorSend(404, 'friend request not found');
    }

    if ($action === 'accept') {
        acceptRequest($database, $sender_id, $receiver_id);
    } elseif ($action === 'decline') {
        declineRequest($database, $sender_id, $receiver_id);
    } else {
        errorSend(400, 'Invalid action');
    }
}

function acceptRequest(SQLite3 $database, int $sender_id, int $receiver_id): void
{
    $database->exec('BEGIN');
    try {
        $res1 = doQuery($database, "INSERT INTO friends (user_id, friend_id) VALUES (:sender_id, :receiver_id)", 
            [':sender_id', $sender_id, SQLITE3_INTEGER], [':receiver_id', $receiver_id, SQLITE3_INTEGER]);
        $res2 = doQuery($database, "INSERT INTO friends (user_id, friend_id) VALUES (:receiver_id, :sender_id)", 
            [':receiver_id', $receiver_id, SQLITE3_INTEGER], [':sender_id', $sender_id, SQLITE3_INTEGER]);
        $res3 = doQuery($database, "DELETE FROM friend_request WHERE sender_id = :sender_id AND receiver_id = :receiver_id", 
            [':sender_id', $sender_id, SQLITE3_INTEGER], [':receiver_id', $receiver_id, SQLITE3_INTEGER]);

        if (!$res1 || !$res2 || !$res3) throw new Exception('DB operation failed');

        $database->exec('COMMIT');
        successSend(['message' => 'friend request accepted']);
    } catch (Exception $e) {
        $database->exec('ROLLBACK');
        errorSend(500, 'Could not accept friend request: ' . $e->getMessage());
    }
}




function declineRequest(SQLite3 $database, int $sender_id, int $receiver_id): void
{
    $res = doQuery($database, "DELETE FROM friend_request WHERE sender_id = :sender_id AND receiver_id = :receiver_id",
        [':sender_id', $sender_id, SQLITE3_INTEGER], [':receiver_id', $receiver_id, SQLITE3_INTEGER]);

    if (!$res) errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

    successSend(['message' => 'friend request declined']);
}

?>