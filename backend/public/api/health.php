<?php
header('Content-Type: application/json');

$status = [
    'status' => 'healthy',
    'timestamp' => time(),
    'php_version' => PHP_VERSION,
    'services' => [
        'php-fpm' => 'running',
        'database' => file_exists('/var/www/database/database.sqlite') ? 'available' : 'not found'
    ]
];

echo json_encode($status);