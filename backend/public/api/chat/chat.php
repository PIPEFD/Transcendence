<?php

require_once __DIR__ . '/header_chat.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$bodyJSON = file_get_contents('php://input');
$body = json_decode($bodyJSON, true);

$requestMethod = $context['requestMethod'];
$queryId = $context['queryId'];

sw













switch ($requestMethod) {
    case 'POST':
        createUser($context); // no pide auth
		break;
    case 'GET':
        if ($queryId) {
            userDataById($context); // no pide auth
        }
        else {
            userList($context); // no pide auth
        }
		break;
    case 'PATCH':
        editUserData($context); // pide auth
		break;
	case 'DELETE':
        deleteUser($context); // pide auth
		break;
    default:
        response(405, 'unauthorized method');
}







?>