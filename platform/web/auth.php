<?php

require_once 'session.php';
require_once 'db.php';

function can_auth($login, $password)
{
    global $db;

    $stmt = $db->prepare('SELECT * FROM users WHERE login = ? AND password = ?');
    $stmt->bind_param('ss', $login, $password);
    $stmt->execute();

    return fetch_one($stmt->get_result());
}

if (array_key_exists('login', $_POST) && array_key_exists('password', $_POST))
{
    $login = $_POST['login'];
    $password = $_POST['password'];

    if ($user = can_auth($login, $password))
    {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['status' => 'ok']);
    }
    else
    {
        echo json_encode(['status' => 'failed']);
    }
}