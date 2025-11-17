<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/header.php';
$database = connectDatabase();
$body = json_decode(file_get_contents('php://input'), true);
$queryId = $_GET['id'] ?? null;
$queryUsername = $_GET['user'] ?? null;
$username = "";

if ($queryUsername && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT user_id FROM users WHERE username = :username";
    $res = doQuery($database, $query, [':username', $queryUsername, SQLITE3_TEXT]);
    $row = $res->fetchArray(SQLITE3_ASSOC);
    if (!$res)
        errorSend(500, 'Sql error ' . $database->lastErrorMsg());
    successSend(['user_id' => $row['user_id']]);
    exit ;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST': createUser($body, $database); break;
    case 'GET': $queryId ? userDataById($database, $queryId) : userList($database); break;
    case 'PATCH': $queryId ? getUserAvatar($database, $queryId) : editUserData($queryId, $body, $database); break;
    case 'DELETE': deleteUser($queryId, $database); break;
    default: errorSend(405, 'Method not allowed');
}

function getUserAvatar(SQLite3 $db, int $id): void {
    if (!is_numeric($id))
        errorSend(400, 'bad petition');
    $sqlQuery = "SELECT avatar_url FROM users WHERE user_id = :id";
    $res = doQuery($db, $sqlQuery, [':id', $id, SQLITE3_INTEGER]);
    if (!$res)
        errorSend(500, "Sqlite error: " . $db->lastErrorMsg());
    if (!$res['avatar_url'])
        errorSend(404, "avatar not found in db");
    $avatarPath = __DIR__ . $result['avatar_url'];
    if (!file_exists($avatarPath))
        errorSend(404, "file not found");

    $info = getimagesize($avatarPath);
    header('Content-Type: ' . $info['mime']);
    readfile($avatarPath);
}

function createUser(array $body, SQLite3 $db): void {
    if (!checkBodyData($body, 'username', 'email', 'pass'))
        errorSend(400, 'Missing fields');

    $username = $body['username'];
    $email = $body['email'];
    $passHash = password_hash($body['pass'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, email, pass) VALUES (:username, :email, :pass)";
    $res = doQuery($db, $sql, [':username', $username, SQLITE3_TEXT], [':email', $email, SQLITE3_TEXT], [':pass', $passHash, SQLITE3_TEXT]);
    if (!$res) errorSend(500, "SQLite error: " . $db->lastErrorMsg());
    successSend(['message' => 'User created', 'user_id' => $db->lastInsertRowID()], 201);
}

function userDataById(SQLite3 $db, int $id): void {
    $sql = "SELECT user_id, username, email, elo FROM users WHERE user_id = :id";
    $res = doQuery($db, $sql, [':id', $id, SQLITE3_INTEGER]);

    if (!$res) {
        errorSend(500, "SQLite error: " . $db->lastErrorMsg());
    }

    $row = $res->fetchArray(SQLITE3_ASSOC);
    $row ? successSend($row) : errorSend(404, 'User not found');
}

function userList(SQLite3 $db): void {
    $res = doQuery($db, "SELECT user_id, username, elo FROM users");
    if (!$res) errorSend(500, "SQLite error: " . $db->lastErrorMsg());
    $users = [];
    while ($r = $res->fetchArray(SQLITE3_ASSOC)) $users[] = $r;
    successSend($users);
}

function editUserData(int $id, array $body, SQLite3 $db): void {
    $updates = [];
    if (isset($body['pass'])) $updates['pass'] = password_hash($body['pass'], PASSWORD_DEFAULT);
    if (isset($body['username'])) $updates['username'] = $body['username'];
    if (isset($body['email'])) $updates['email'] = $body['email'];

    foreach ($updates as $col => $val) {
        $sql = "UPDATE users SET $col = :val WHERE user_id = :id";
        $res = doQuery($db, $sql, [':val', $val, SQLITE3_TEXT], [':id', $id, SQLITE3_INTEGER]);
        if (!$res) errorSend(500, "SQLite error updating $col");
    }
    successSend(['message' => 'User updated']);
}

function deleteUser(int $id, SQLite3 $db): void {
    $sql = "DELETE FROM users WHERE user_id = :id";
    $res = doQuery($db, $sql, [':id', $id, SQLITE3_INTEGER]);
    if (!$res) errorSend(500, "SQLite error: " . $db->lastErrorMsg());
    successSend(['message' => 'User deleted']);
}
?>
