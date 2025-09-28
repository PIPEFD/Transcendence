<?php

require_once __DIR__ . '/header.php';

$requiredMethod = $context['requestMethod'];
$queryId = $context['queryId'];

if ($requiredMethod !== 'GET')
    errorSend(405, 'unauthorized');

if (!$queryId)
    globalRankingList($context);
friendsRankingList($context);

function globalRankingList($context) {
    if (!$context['auth'])
        errorSend(403, 'forbidden access');
    
    $database = $context['database'];
    $sqlQuery = "SELECT u.user_id, u.username, u.elo FROM users u INNER JOIN friends f 
        ON (u.user_id = f.friend_id OR u.user_id = f.user_id) WHERE $id IN (f.user_id, f.friend_id)
        AND u.user_id != $id ORDER BY u.elo DESC";
    $res = $database->query($sqlQuery);
    if (!$res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
    $data = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC))
        $data[] = $row;
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit ;
}

function friendsRankingList($context) {
    if (!$context['auth'])
        errorSend(403, 'forbidden access');
    
    $database = $context['database'];
    $sqlQuery = "SELECT user_id, username, elo FROM users ORDER BY elo DESC";
    $res = $database->query($sqlQuery);
    if (!$res)
        errorSend(500, 'Sql error: ' . $database->lastErrorMsg());
    $data = [];
    while ($row = $res->fetchArray(SQLITE3_ASSOC))
        $data[] = $row;
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit ;
}

?>