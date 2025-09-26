<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();

$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);
$queryId = $_GET['id'] ?? null;

switch ($requestMethod)
{
	case 'POST':
		createUser($body, $database);
		break;
	case 'GET':gi
		if ($queryId)
			userDataById($database, $queryId);
		else
			userList($database);
		break;
	case 'PATCH':
		editUserData($tokenId, $queryId, $body, $database);
		break;
	case 'DELETE':
		deleteUser($queryId, $database);
		break;
	default:
		errorSend(405, 'unauthorized method');
	exit;
}

function createUser(array $body, SQLite3 $database): void
{
	if (!checkBodyData($body, 'username', 'email', 'pass'))
		errorSend(400, 'bad request');
	$username = $body['username'];
	$email = $body['email'];
	$pass = $body['pass'];

	$passHash = password_hash($pass, PASSWORD_DEFAULT);

	$sqlQuery = "INSERT INTO users (username, email, pass) VALUES (:username, :email, :pass)";
	$stmt = $database->prepare($sqlQuery);
	if (!$stmt)
		errorSend(500, 'Sql error preparing stmt: ' . $database->lastErrorMsg());

	$stmt->bindValue(':username', $username, SQLITE3_TEXT);
	$stmt->bindValue(':email', $email, SQLITE3_TEXT);
	$stmt->bindValue(':pass', $passHash, SQLITE3_TEXT);

	$res = $stmt->execute();
	if (!$res)
		errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
	else
		echo json_encode(['success' => 'new user created']);
}

function userDataById(SQLite3 $database, int $queryId): void
{
	$sqlQuery = "SELECT username, email, elo FROM users WHERE id = ':queryId'";
	$stmt = $database->prepare($sqlQuery);
	$stmt->bindValue(':queryId', $queryId);
	$res = $stmt->execute();
	if (!$res)
		errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
	if (!$res->fetchArray(SQLITE3_ASSOC))
		errorSend(404, 'user not found');
	echo json_encode($res->fetchArray(SQLITE3_ASSOC));
}

function userList(SQLite3 $database): void
{
	$sqlQuery = "SELECT id, username, elo FROM users";
	$res = $database->query($sqlQuery);
	if (!$res)
		errorSend(500, 'Sql error: ' . $database->lastErrorMsg());

	$data = [];
	while ($row = $res->fetchArray(SQLITE3_ASSOC)) // fetchArray tiene un indice interno que aumenta con cada llamada
		$data[] = $row;

	echo json_encode($data);
}

function editUserData(int $queryId, array $body, SQLite3 $database): void
{
	if (checkJWT($queryId))
		errorSend(403, 'forbidden access');

	if (checkBodyData($body, 'pass'))
	{
		$newPass = $body['pass'];
		$newPassHash = password_hash($newPass, PASSWORD_DEFAULT);
		editUserDataAux($queryId, 'pass', $newPassHash, $database);
	}
	if (checkBodydata($body, 'username'))
		editUserDataAux($queryId, 'username', $body['username'], $database);
	if (checkBodydata($body, 'email'))
		editUserDataAux($queryId, 'email', $body['email'], $database);
	echo json_encode(['success' => 'user data modified']);
}

function editUserDataAux(int $queryId, string $column, string $newValue, SQLite3 $database): void
{
	switch ($column) 
	{ // solo podemos insertar con prepare() valores, ni nombres de tablas ni columnas
		case 'pass': 
			$sqlQuery = "UPDATE users SET pass = :newValue WHERE id = :queryId"; 
			break;
		case 'username':
			$sqlQuery = "UPDATE users SET username = :newValue WHERE id = :queryId";
			break;
		case 'email':
			$sqlQuery = "UPDATE users SET email = :newValue WHERE id = :queryId";
			break;
	}
	$stmt = $database->prepare($sqlQuery);
	$stmt->bindValue(':newValue', $newValue);
	$stmt->bindValue(':queryId', $queryId);
	$res = $stmt->execute();
	if(!$res || !$res->fetchArray())
		errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
	else
		echo json_encode(['success' => 'password updated']);
}

function deleteUser(int $queryId, SQLite3 $database) 
{
	if (checkJWT($queryId))
		errorSend(403, 'forbidden access');

	$sqlQuery = "DELETE FROM users WHERE id = :queryId";
	$stmt =	$database->prepare($sqlQuery);
	$stmt->bindValue(':queryId', $queryId);
	$res = $stmt->execute();
	if (!$res || $res->fetchArray())
		errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
	else
		echo json_encode(['success' => 'user deleted']);
}

?>