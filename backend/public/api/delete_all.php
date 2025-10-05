<?php
require_once __DIR__ . '/header.php';

$database = connectDatabase();

try {
    $database->exec('BEGIN');

    // Lista de tablas que quieres vaciar
    $tables = ['twofa_codes', 'friend_request', 'friends', 'ranking', 'users'];
    foreach ($tables as $table) {
        $database->exec("DELETE FROM $table");
    }

    $database->exec('COMMIT');
    successSend('✅ All tables cleared');
} catch (Exception $e) {
    $database->exec('ROLLBACK');
    errorSend(500, 'Failed to clear database', $e->getMessage());
}
