<?php

require_once '../config/config.php';
require_once 'header.php';

$database = connectDatabase();
$uploadsPath = __DIR__ . '/uploads/';

if (!isset($_FILES['avatar']) || !isset($_POST['userId']) || $_REQUEST['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode(['error' => 'bad petition']);
    exit ;
}
// comprobacion de peticion bien hecha (existencia de userId y avatar)

if (!checkJWT($_POST['userId'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit ;
}

// anhadir la gestion de anhadido del archivo a /uploads si ya esta creado,
// sino tendre que crearlo yo 

?>