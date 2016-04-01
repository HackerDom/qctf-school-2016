<?php
$mysqli = new mysqli("localhost", "root", "", "nonescaping");

if ($mysqli->connect_errno) {
    trigger_error("Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}

?>