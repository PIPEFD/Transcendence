<?php

// Carga el autoloader de Composer => para que encuentre la clase Google\Client
require_once(__DIR__ . '/../../../../vendor/autoload.php');

// Ruta al archivo de credenciales descargado de Google Cloud (relativa al repo)
$credentialsPathCandidate = realpath(__DIR__ . '/../../../../secrets/google_oauth_client.json');

// Primary token path: relative to this script directory
$relativeTokenPath = __DIR__ . '/google_token.json';

// Fallback token path: system temp dir
$tmpTokenPath = sys_get_temp_dir() . '/transcendence_gmail_token.json';

// Determine credentials path
if ($credentialsPathCandidate && file_exists($credentialsPathCandidate)) {
	$credentialsPath = $credentialsPathCandidate;
} else {
	throw new Exception('No se encuentra el archivo de credenciales. Descárgalo de Google Cloud y guárdalo en: ' . __DIR__ . '/../../../../secrets/google_oauth_client.json');
}

$client = new Google\Client();
$client->setApplicationName('Transcendence 2FA Setup');
$client->setScopes(['https://www.googleapis.com/auth/gmail.send']);
$client->setAuthConfig($credentialsPath);
$client->setAccessType('offline'); // Solicita un refresh_token
$client->setPrompt('select_account consent');

// 1. Generar la URL de autorización
$authUrl = $client->createAuthUrl();
echo "Abre esta URL en tu navegador para autorizar la aplicación:\n\n";
echo $authUrl . "\n\n";

// 2. Pedir el código de verificación al usuario
echo "Pega el código de autorización (en el URL entre code= y &scope) aquí y presiona Enter: ";
$authCode = trim(fgets(STDIN));

// 3. Intercambiar el código de verificación por un token de acceso
$accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

// 4. Comprobar si hubo un error
if (array_key_exists('error', $accessToken))
	throw new Exception("Error al obtener el token: " . join(', ', $accessToken));

// 5. Guardar el token (incluyendo el refresh_token) en un archivo
$savedTo = null;

// Try to save to relative path first
try {
	$json = json_encode($accessToken, JSON_PRETTY_PRINT);
	if (@file_put_contents($relativeTokenPath, $json) !== false) {
		$savedTo = $relativeTokenPath;
	}
} catch (Exception $e) {
	// ignore, we'll try fallback
}

// If not saved, try fallback to tmp dir
if (!$savedTo) {
	if (@file_put_contents($tmpTokenPath, $json) !== false) {
		$savedTo = $tmpTokenPath;
	}
}

if ($savedTo) {
	printf("¡Éxito! El token ha sido guardado en: %s\n", $savedTo);
	printf("Ahora tu aplicación puede enviar correos (modo desarrollo o con token guardado).\n");
} else {
	// Last resort: print token to stdout (careful with secrets)
	echo "ERROR: No se pudo escribir el token en disco. Aquí está el token (córtalo y pégalo en un archivo " . $relativeTokenPath . "):\n";
	echo $json . "\n";
}

