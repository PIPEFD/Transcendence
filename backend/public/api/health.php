<?php
/**
 * Health Check Endpoint
 * Returns the status of the backend service
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check database connection
$db_status = 'unknown';
try {
    $db_path = __DIR__ . '/../../database/transcendence.db';
    if (file_exists($db_path)) {
        $db = new SQLite3($db_path);
        $result = $db->query('SELECT 1');
        if ($result) {
            $db_status = 'ok';
        }
        $db->close();
    } else {
        $db_status = 'database_file_not_found';
    }
} catch (Exception $e) {
    $db_status = 'error: ' . $e->getMessage();
}

// Response
$response = [
    'status' => 'ok',
    'service' => 'transcendence-backend',
    'timestamp' => date('Y-m-d H:i:s'),
    'database' => $db_status,
    'php_version' => phpversion()
];

http_response_code(200);
echo json_encode($response, JSON_PRETTY_PRINT);
