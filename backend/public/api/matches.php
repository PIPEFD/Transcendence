<?php

require_once __DIR__ . '/header.php';

$database = connectDatabase();
$requestMethod = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

if ($requestMethod !== 'POST') 
	errorSend(405, 'unauthorized method');
if (!checkBodyData($body, 'win_id', 'loser_id'))
	errorSend(400, 'bad request');
$winner_id = $body['winner_id'];
$loser_id = $body['loser_id'];
if (!(checkJWT($winner_id) || checkJWT($loser_id)))
	errorSend(403, 'forbidden access');

updateElo($database, $winner_id, $loser_id);

function updateElo(SQLite3 $database, int $win_id, int $ls_id): void
{
	$winElo = getElo($database, $win_id);									
	$lsElo = getElo($database, $ls_id);

	$newWinElo = operateElo($winElo, $lsElo, true);
	$newLsElo = operateElo($lsElo, $winElo, false);

	$database->exec('BEGIN');
	try
	{
		updateEloAux($database, $win_id, $newWinElo, true);
		updateEloAux($database, $ls_id, $newLsElo, false);
		$database->exec('COMMIT');
		successSend('elo updated');
	}
	catch (Exception $e)
	{
		$database->exec('ROLLBACK');
		errorSend(500, 'couldn\'t update elo');
	}
}

function getElo(SQLite3 $database, int $user_id): int
{
	$sqlQ = "SELECT user_id, elo FROM users WHERE user_id = :user_id";
	$bind1 = [':user_id', $user_id, SQLITE3_INTEGER];
	$res = doQuery($database, $sqlQ, $bind1);
	if (!$res)
		errorSend(500, 'SQL error ' . $database->lastErrorMsg());
	$row = $res->fetchArray(SQLITE3_ASSOC);
	if (!$row)
		errorSend(400, 'couldn\'t find user elo');
	return $row['elo'];
}

function operateElo(int $oldElo, int $oppElo, bool $win) 
{
	$k = 32;
	$expected = 1 / (1 + pow(10, ($oppElo - $oldElo) / 400));
	$newElo = $oldElo + $k * ($win - $expected);
	return round($newElo);
}

function updateEloAux(SQLite3 $database, int $user_id, int $newElo, bool $win): void
{
	$sqlQ = "UPDATE users SET elo = :newElo WHERE user_id = :user_id";
	$bind1 = [':newElo', $newElo, SQLITE3_INTEGER];
	$bind2 = [':user_id', $user_id, SQLITE3_INTEGER];
	$res = doQuery($database, $sqlQ, $bind1, $bind2);
	if (!$res)
		throw new Exception ('SQL error ' . $database->lastErrorMsg());

	$sqlQ = "SELECT games_played, games_win, games_lose FROM ranking WHERE user_id = :user_id";
	$bind1 = [':user_id', $user_id, SQLITE3_INTEGER];
	$res = doQuery($database, $sqlQ, $bind1);
	if (!$res)
		throw new Exception ('SQL error ' . $database->lastErrorMsg());
	$row = $res->fetchArray(SQLITE3_ASSOC);
	if (!$row)
		throw new Exception ('Couldn\'t find ranked data');

	$bind1 = [':games_played', $row['games_played'] + 1, SQLITE3_INTEGER];
	$columnToUpdate = $win ? 'games_win' : 'games_lose';
	$newValue = $row[$columnToUpdate] + 1;
	$bind2 = [':newValue', $newValue, SQLITE3_INTEGER];
	$bind3 = [':user_id', $user_id, SQLITE3_INTEGER];
	$sqlQ = "UPDATE ranking SET games_played = :games_played, $columnToUpdate = :newValue WHERE user_id = :user_id";
	$res = doQuery($database, $sqlQ, $bind1, $bind2, $bind3);
	if (!$res)
		throw new Exception ('SQL error ' . $database->lastErrorMsg());
}

?>

<!-- HOLA la idea es tener la funcion searchPlayers() la cual recibe el -->
<!-- numero de jugadores que se buscan (variable para un solo partido -->
<!-- o para un torneo) el formato es player_id: y player_search: x,   -->
<!-- function searchPlayers($context)   -->
<!-- {  -->
<!-- 	if (!$context['auth'])  -->
<!-- 		errorSend(403, 'forbidden');  -->
<!--   -->
<!-- 	$database = $context['database'];  -->
<!-- 	$playerId = getAndCheck($context['body']['player_id']);  -->
<!-- 	$limit = getAndCheck($context['body']['player_search']);  -->
<!--   -->
<!-- 	$playerElo = $database->query_single("SELECT elo FROM users WHERE user_id = '$playerId'");  -->
<!-- 	if (!$playerElo)  -->
<!-- 		errorSend(404, 'player not found');  -->
<!-- 	$sqlQuery = "SELECT user_id, elo, ABS(elo - '$playerElo') AS diff  -->
<!-- 	FROM users WHERE user_id != '$playerId' ORDER BY diff ASC LIMIT '$limit'";  -->
<!-- 	$res = $database->query($sqlQuery);  -->
<!-- 		  -->
<!-- 	$data = [];  -->
<!-- 	while ($row = $res->fetchArray(SQLITE3_ASSOC))  -->
<!-- 		$data[] = $row;  -->
<!-- 	echo json_encode($data, JSON_PRETTY_PRINT);  -->
<!-- 	exit ;  -->
<!-- }  -->