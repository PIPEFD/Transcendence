<?php

header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);	

require_once __DIR__ . '../../../config/config.php';

function errorSend(int $errorCode, string $errorMsg, ?string $detailsMsg = null): void
{
	http_response_code($errorCode);
	$response = ['error' => $errorMsg]; //inicia response y luego le asigna su primera pareja
	if ($detailsMsg)
		$response['details'] = $detailsMsg; //añade una nueva entrada al array response
	echo json_encode($response);
	exit;
}

?>
