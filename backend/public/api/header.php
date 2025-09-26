<?php

header('Content-Type: application/json'); // Indica al navegador/cliente que la respuesta será texto en formato JSON.

header('Access-Control-Allow-Origin: *'); // Permite que cualquier (*) dominio ("origen"), distinto al del servidor, pueda solicitar y acceder a los recursos de tu API. Sin esta cabecera, los navegadores bloquearían por defecto las peticiones AJAX provenientes de un dominio diferente por razones de seguridad.
// AJAX: es un conjunto de técnicas de desarrollo web que permiten a una aplicación web comunicarse con un servidor en segundo plano sin interferir con el estado de la página actual. Permite que partes específicas de una página web se actualicen con nueva información del servidor sin necesidad de recargar la página por completo.
// Ejemplo: mientras el cliente navega en mi web se comunica con una web de terceros para actualizar mis precios, por defecto el navegador bloquea esta clase de acción
header('Access-Control-Allow-Methods: GET, POST, DELETE, PATCH'); // Indica al navegador qué métodos HTTP (además de los métodos simples como GET o HEAD) están permitidos al realizar una solicitud desde un origen externo (la web de terceros del ejemplo).
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Se permite que la solicitud del cliente externo contenga las cabeceras Content-Type y Authorization (comúnmente usada para enviar credenciales de autenticación, como tokens).

ini_set('display_errors', 1); // Activa mostrar errores en pantalla para este proceso PHP (útil en desarrollo).
ini_set('display_startup_errors', 1); // Muestra errores que ocurren al arrancar PHP o extensiones antes de ejecutar el script.
error_reporting(E_ALL);

require_once __DIR__ . 'utils.php';
require_once __DIR__ . '../config/config.php';
require_once __DIR__ . '/../../vendor/autoload.php';

$database = connectDatabase();

$requestMethod = $_SERVER['REQUEST_METHOD'];
$bodyArray = json_decode(file_get_contents('php://input'), true);
$queryId = $_GET['id'] ?? null;

$authToken = $_SERVER['HTTP_AUTHORIZATION'] ?? null;

// $auth = checkAuthorization($authToken);
// $idFromAuth = extractIdFromAuth($authToken, $auth);

$context = 
[
    'database' => $database,
    'requestMethod' => $requestMethod,
    'body' => $bodyArray,
	'queryId' => $queryId,
    'authToken' => $authToken
];

function errorSend(int $errorCode, string $errorMsg, ?string $detailsMsg = null): void
{
	http_response_code($errorCode); //obtiene o establece el código de estado de la respuesta HTTP, si le pasas un numero entero establece la respuesta a ese número, si no le pasas ningún argumento te devuelve el code actual
	$response = ['error' => $errorMsg]; //inicia response y le asigna su primera pareja
	if ($detailsMsg)
		$response['details'] = $detailsMsg; //añade una nueva entrada al array response
	echo json_encode($response);
	exit;
}

// errorSend(400, 'bad request'); -> si falla
function checkData($data): bool
{
	if (!isset($data) || !$data)
		return false;
	return true;
}

// errorSend(400, 'bad request'); -> si falla
function checkIfIdExists($id, $database, $tableName='users'): bool
{
	if (!is_numeric($id))
		return false;
	$stmt = $database->prepare("SELECT 1 FROM :tableName WHERE id = :id LIMIT 1");
	$stmt->bindValue(':tableName', $tableName);
	$stmt->bindValue(':id', $id);
	$res = $stmt->execute();
	if (!$res || !$res->fetchArray()) // $res se evalua como true a menos que haya un error, incluso si no encuentra el Id. fetchArray() devuelve un array si encontró una fila
		return false;
	return true;
}

function getDecodedJWT(?string $authToken): ?object // ? -> la función tambíen recibe & devuelve un valor nulo
{
	if (!$authToken)
		return null;
	list($jwt) = sscanf($authToken, 'Bearer %s'); // sscanf() busca Bearer seguido de un string en $authToken. Devuelve un array con todas las coincidencias.
	if (!$jwt) // list asigna los elementos del array a las variables que le pasamos como argumentos, en este caso solo $jwt
		return null;
	$secretKey = getenv('JWTsecretKey'); // necesitamos la clave que usamos para generar el token para decodificarlo, hay que incluirla en el .env del directorio de docker-compose.
	if ($secretKey === false)
		errorSend(500, "FATAL: JWT_SECRET_KEY no está configurada en el entorno.");
	try
	{
		$decodedToken = Firebase\JWT\JWT::decode($jwt, new Firebase\JWT\Key($secretKey, 'HS256')); //HS256 => el algoritmo que usamos para crear el token
		return $decodedToken;
	}
	catch (Exception $e)
	{
		error_log("Couldn't decodify JWT -> " . $e->getMessage());
		return null;
	}
}

function extractUserIdFromJWT(?object $decodedToken): ?int 
{
    if ($decodedToken === null)
		return null;
	return ($decodedToken->data->userId);
}

?>