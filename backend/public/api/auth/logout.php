<?php

require_once __DIR__ . '/header_auth.php';

$database = connectDatabase();	// Abre o crea el archivo de base de datos SQLite y devuelve un objeto conexión listo para usar. tipo del objeto: SQLite3
$requestMethod = $_SERVER['REQUEST_METHOD'];	// Lee el método HTTP de la petición actual (GET, POST, PATCH, DELETE).

if ($requestMethod != 'POST')
	errorSend(405, 'Method Not Allowed');

http_response_code(200);
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
exit;

// El logout es una acción que debe realizar el frontend
// Debe eliminar el JWT que tiene almacenado

?>
