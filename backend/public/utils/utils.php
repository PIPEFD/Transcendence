<?php

require __DIR__ . '/../../vendor/autoload.php';

function response($status, $data) 
{
    if ($status == 200) 
	{
        echo json_encode(['success' => $data]);
    }
	else 
	{
        http_response_code($status);
        echo json_encode(['error' => $data]);
    }
    exit ;
}

function isId($num) {
    if (is_numeric($num))
        return ($num);
    response (400, 'bad request');
    return null ;
}

function getAndCheck($body, $content) {
    if (!isset($body[$content]))
        response(400, 'bad request: missing field');
    $data = $body[$content];
    if (!$data)
        response(400, 'bad request');
    // if (checkSqlInjection($data) === false)
    //     response(403, 'FORBIDDEN');
    return ($data);
}

function checkSqlInjection($string) {
	echo json_encode(['debugINJEDCTION' => $string]);
    $blacklist = [
        'select', 'insert', 'update', 'drop', 'truncate',
        'union', 'or', 'and', '--', ';', '/*', '*/', '@@',
        'char', 'nchar', 'varchar', 'nvarchar', 'exec', 'xp_'
    ];
    $lowerStr = strtolower($string);
    foreach ($blacklist as $word) {
        if (strpos($lowerStr, $word) !== false)
            return false;
    }
    return (true);
}

function checkIfExists($id, $database) {
    $num = isId($id);
    $sqlQuery = "SELECT 1 FROM users WHERE id = '$num' LIMIT 1";
    $res = $database->query($sqlQuery);
    if (!$res)
        return false;
    return true;
}

function operateElo($oldElo, $oppElo, $score) {
    $k = 32;
    $expected = 1 / (1 + pow(10, ($oppElo - $oldElo) / 400));
    $newElo = $oldElo + $k * ($score - $expected);
    return (round($newElo));
}

function checkAuthorization(?string $authHeader): ?object // ? -> la función tambíen recibe/devuelve un valor nulo
{
	if (!$authHeader)
		return (null);
	list($jwt) = sscanf($authHeader, 'Bearer %s'); // sscanf() busca Bearer seguido de un strin en $authHeader. Devuelve un array con todas las coincidencias.
	if (!$jwt) // list asigna los elementos del array a variables
		return (null);
	$secretKey = getenv('JWTsecretKey'); // necesitamos la clave que usamos para generar el token para decodificarlo, hay que incluirla en el .env del directorio del docker-compose, podemos poner un .env provisional en nuestra rama. Que uno de los modulos que Parse quería hacer es de gestionar secretos.
	if ($secretKey === false)
	{
		error_log("FATAL: JWT_SECRET_KEY no está configurada en el entorno.");
		return (null);
	}
	try
	{
		$decodedToken = Firebase\JWT\JWT::decode($jwt, new Firebase\JWT\Key($secretKey, 'HS256')); //HS256 => el algoritmo que usamos para crear el token
		return ($decodedToken);
	}
	catch (Exception $e)
	{
		error_log('Cannot decode authentification token ' . $e->getMessage());
		return (null);
	}
}

// extraer el Id del token, en caso de no ser valido retornara null
function extractIdFromAuth(?object $decodedToken): ?int 
{
    if ($decodedToken === null)
		return (null);
	$userId = $decodedToken->data->userId;
	return ($userId);
}

?>