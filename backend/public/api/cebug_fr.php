<?php
require_once __DIR__ . '/header.php';
$database = connectDatabase();

// Traer todas las amistades con los nombres de usuario
$sql = "
    SELECT f.user_id, f.friend_id, u.username AS friend_name
    FROM friends f
    JOIN users u ON u.id = f.friend_id
";
$res = $database->query($sql);

$friends = [];
while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $friends[] = $row;
}

header('Content-Type: application/json');
echo json_encode($friends, JSON_PRETTY_PRINT);
?>