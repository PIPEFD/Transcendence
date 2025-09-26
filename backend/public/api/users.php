<?php

require_once __DIR__ . '/header.php';

// var_dump($context);
$requestMethod = $context['requestMethod'];
$queryId = $context['queryId'];

switch ($requestMethod) {
    case 'POST':
        createUser($context); // NO auth
		break;
    case 'GET':
        if ($queryId) {
            userDataById($context); // NO auth
        }
        else {
            userList($context); // NO auth
        }
		break;
    case 'PATCH':
        editUserData($context); // SI auth
		break;
	case 'DELETE':
        deleteUser($context); // SI auth
		break;
    default:
        errorSend(405, 'unauthorized method');
}

function userList($context) {
    $database = $context['database'];

    $sqlQuery = "SELECT id, username, elo FROM users";
    $res = $database->query($sqlQuery);
    if (!$res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

    $data = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC))
        $data[] = $row;

    echo json_encode($data);
    exit ;
}

function userDataById($context) {
    $database = $context['database'];
	
    $queryId = $context['queryId'];
	if (!is_numeric($queryId))
		response (400, 'bad request');
	
    $sqlQuery = "SELECT username, email, elo FROM users WHERE id = '$queryId'";
    $res = $database->query($sqlQuery);
    if (!$res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
    if (!($res->fetchArray(SQLITE3_ASSOC)))
        errorSend(404, 'user not found');

    echo json_encode($res->fetchArray(SQLITE3_ASSOC));
    exit ;
}

function createUser($context) {
    $database = $context['database'];
    $body = $context['body'];

    $username = getAndCheck($body, 'username');
    $email = getAndCheck($body, 'email');
    $pass = getAndCheck($body, 'password');
    $passwordHash = password_hash($pass, PASSWORD_DEFAULT);

    $sqlQuery = "INSERT INTO users (username, email, pass) VALUES (:username, :email, :pass)";
	$stmt = $database->prepare($sqlQuery);
	if (!$stmt)
		errorSend(500, 'Sql error preparing stmt: ' . $database->lastErrorMsg());
	$stmt->bindValue(':username', $username, SQLITE3_TEXT);
	$stmt->bindValue(':email', $email, SQLITE3_TEXT);
	$stmt->bindValue(':pass', $passwordHash, SQLITE3_TEXT);
	$res = $stmt->execute();
    if (!$res) {
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
    }

    echo json_encode(['success' => 'new user created']);
    exit ;
}

function editUserData($context) {
    $id = $context['tokenId'];
    if ($id !== $context['queryId'])
        errorSend(403, 'forbidden access');
    $body = $context['body'];
    $database = $context['database'];

    if ($context['body']['password'])
        editUserPass($id, $body, $database);

    $username = getAndCheck($body, 'username');
    $email = getAndCheck($body, 'email');

    $updates = [ "username = '$username'", "email = '$email'" ];
    $sqlQuery = "UPDATE users SET" . implode(', ', $updates) . "WHERE id = '$id'";
    $res = $database->exec($sqlQuery);
    if (!res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

    echo json_encode(['success' => 'user data modified']);
    exit ;
}

function editUserPass($id, $body, $database) {
    $newPassword = getAndCheck($body, 'password');
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $sqlQuery = "UPDATE users SET pass = '$newPasswordHash' WHERE id = '$id'";
    $res = $database->exec($sqlQuery);
    if (!res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

    echo json_encode(['success' => 'password updated']);
    exit ;
}

function deleteUser($context) {
/*     if ($context['tokenId'] !== $context['queryId'])
        errorSend(403, 'forbidden access'); */
    $database = $context['database'];

    $sqlQuery = "DELETE FROM users WHERE id = 7";
    $res = $database->exec($sqlQuery);
    if (!$res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
    
    echo json_encode(['success' => 'user deleted']);
    exit ;
}

?>