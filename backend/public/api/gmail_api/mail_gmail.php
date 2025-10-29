<?php

require_once(__DIR__ . '/../../../vendor/autoload.php'); // Incluye el índice de Composer => para usar las clases de Google

function gmailClient(): Google\Client
{
    $client = new Google\Client();
    $client->setApplicationName('Transcendence');
    $client->setScopes([Google\Service\Gmail::GMAIL_SEND]); //GMAIL_SEND es una constante de la librería de Google usada para referirse a la URL del scope
    $client->setAuthConfig(__DIR__ . '/../../../secrets/google_oauth_client.json');
    $client->setAccessType('offline'); // Al solicitar acceso offline, le estás pidiendo a Google que, además del access_token de corta duración, //te entregue un refresh_token. Este es un token especial de larga duración. Su única función es permitir que tu servidor, //de forma automática y sin intervención del usuario, lo intercambie por un nuevo access_token cada vez que el antiguo caduque. //La alternativa, el acceso online, se tiene que renovar cada hora.

	// Prefer relative token in the gmail_api folder
	$relativeToken = __DIR__ . '/../auth/gmail_api/google_token.json';
	$tmpToken = sys_get_temp_dir() . '/transcendence_gmail_token.json';

	$tokenPath = null;
	if (file_exists($relativeToken)) {
		$tokenPath = $relativeToken;
	} elseif (file_exists($tmpToken)) {
		$tokenPath = $tmpToken;
	} else {
		throw new Exception('Falta google_token.json. Ejecuta el script de setup para generarlo.');
	}

	$accessToken = json_decode(file_get_contents($tokenPath), true);
    $client->setAccessToken($accessToken);

	if ($client->isAccessTokenExpired())
	{
		// Only attempt refresh if token was writable (relative path)
		$client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
		if (is_writable(dirname($tokenPath))) {
			@file_put_contents($tokenPath, json_encode($client->getAccessToken(), JSON_PRETTY_PRINT));
		}
	}
    return $client;
}

function sendMailGmailAPI(string $id, string $mail, string $code): bool
{
	try
	{
		$client = gmailClient();
		$gmail = new Google\Service\Gmail($client);

		$message = "From: 'me'\r\n";
		$message .= "To: {$mail}\r\n";
		$message .= "Subject: code for user => {$id}\r\n";
		$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
		$message .= "\r\n";
		$message .= "CODE: " . $code;
		$message .= "\r\n";

		$rawMessage = rtrim(strtr(base64_encode($message), '+/', '-_'), '=');

		$gmailMessage = new Google\Service\Gmail\Message();
		$gmailMessage->setRaw($rawMessage);

		$gmail->users_messages->send('me', $gmailMessage);
	}
	catch(Exception $e)
	{
		error_log('Gmail API Error: ' . $e->getMessage());
		return false;
	}
	return true;
}
