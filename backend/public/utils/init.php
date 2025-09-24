<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

header('Content-Type: application/json'); 	// Indica al navegador/cliente que la respuesta será texto en formato JSON.

ini_set('display_errors', 1);				// Activa mostrar errores en pantalla para este proceso PHP (útil en desarrollo).
ini_set('display_startup_errors', 1);		// Muestra errores que ocurren al arrancar PHP o extensiones antes de ejecutar el script.
error_reporting(E_ALL);

require 'utils.php';
require '../config/config.php';
$database = connectDatabase();
$authToken = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
$requestMethod = $_SERVER['REQUEST_METHOD'];
$auth = checkAuthorization($authToken);
$idFromAuth = extractIdFromAuth($authToken, $auth);
$bodyArray = json_decode(file_get_contents('php://input'), true);
$queryId = $_GET['id'] ?? null;

$context = [
    'database' => $database,
    'requestMethod' => $requestMethod,
    'auth' => $auth,
    'tokenId' => $idFromAuth,
    'queryId' => $queryId,
    'body' => $bodyArray
];

?>