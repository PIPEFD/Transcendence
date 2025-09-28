<?php

require_once __DIR__ . '/header.php';
require_once __DIR__ . '/gmail_api/mail_gmail.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

if ($requestMethod !== 'POST')
	errorSend(405, 'unauthorized method');
if (!stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) // stripos() => STRing Insensitive POSition => Devuelve la posición de una subcadena en otra, sin distinguir mayúsculas/minúsculas. Si no encuentra la subcadena devuelve 'false'.
	errorSend(415, 'unsupported media type');
if (!is_array($body)) // El cuerpo del HTTP request debería ser JSON que represente un objeto. En PHP eso se traduce en un array asociativo. Si no lo es, el JSON es inválido o no tiene la estructura esperada.
	errorSend(400, 'invalid json');
if (!checkBodyData($body, 'username', 'password'))
	errorSend(400, 'Bad request. Missing fields');

$username = $body['username'];
$passwordSent = $body['password'];

$sqlQuery = "SELECT user_id, password, email FROM users WHERE username = :username";
$bind1 = [':username', $username, SQLITE3_TEXT];
$res1 = doQuery($database, $sqlQuery, $bind1);
if (!$res1)
	errorSend(500, "SQLite Error: " . $database->lastErrorMsg());
$row = $res1->fetchArray(SQLITE3_ASSOC); // Para obtener filas concretas necesitas llamar a fetchArray() sobre $result. $row = $result->fetchArray(SQLITE3_ASSOC); SQLITE3_ASSOC => Indica que queremos la fila como array asociativo.
if (!$row)
	errorSend(404, 'username not found');

$user_id = $row['id'];
$passwordStored = $row['password'];
$email = $row['email'];

if (!password_verify($passwordSent, $passwordStored)) // $passwordStored contiene el hash + los medios para desencriptarlo
	errorSend(401, 'invalid credentials');

$stmt_delete = $database->prepare('DELETE FROM twofa_codes WHERE user_id = :user_id'); // Eliminamos cualquier entrada previa en la tabla twofa_codes para este usuario
$stmt_delete->bindValue(':user_id', $user_id, SQLITE3_INTEGER);
if (!$res_delete = $stmt_delete->execute()) // no da error porque no exista info previa sobre el user
	errorSend(500, "SQLite Error: " . $database->lastErrorMsg());

$two_fa_code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT); // Generamos un código númerico aleatorio del 0 al 999999 (rellenamos con 0s empezando por la izq hasta tener 6 cifras)

$stmt_insert = $database->prepare('INSERT OR REPLACE INTO twofa_codes (user_id, code) VALUES (:user_id, :code)'); // replace hace un DELETE seguido de un INSERT en la fila que causa el conflicto de la clave única
$stmt_insert->bindValue(':user_id', $user_id, SQLITE3_INTEGER);
$stmt_insert->bindValue(':code', $two_fa_code, SQLITE3_TEXT);
if ($stmt_insert->execute() === false)
	errorSend(500, 'couldn`t insert two_fa_code');

if (!sendMailGmailAPI($user_id, $email, $two_fa_code))
	errorSend(500, 'couldn\'t send mail with Gmail API');

echo json_encode(['pending_2fa' => true, 'user_id' => $user_id]);
exit;
