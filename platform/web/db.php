<?php

function connect_to_database()
{
    $host = 'localhost';
    $user = 'platform';
    $password = 'zxfPkqe4NXsUlXWKfoNC';
    $database = 'platform';
    $db = new mysqli($host, $user, $password, $database);
    if ($db->connect_error) 
        die('Ошибка подключения к базе данных: ' . $db->connect_error);

    return $db;
}

/* Auto-connect */
$db = connect_to_database();

function fetch_all($query, $field=false)
{
    $result = [];
    while ($a = $query->fetch_assoc())
    {
        if ($field !== false)
            $result[$a[$field]] = $a;
        else
            $result[] = $a;            
    }
    return $result;
}

function fetch_one($query)
{
    if ($query->num_rows == 0)
        return false;
    return $query->fetch_assoc();
}

function get_users()
{
    global $db;

    $query = $db->query('SELECT * FROM users');
    return fetch_all($query, 'id');
}

function get_task($task_id)
{
    global $db;

    $stmt = $db->prepare('SELECT * FROM tasks WHERE id = ?');
    $stmt->bind_param('d', $task_id);
    $query = $stmt->execute();
    $task = fetch_one($stmt->get_result());
    return $task;
}

function create_submission($user_id, $task_id, $answer, $is_correct)
{
    global $db;

    $stmt = $db->prepare('INSERT INTO submission (user_id, task_id, answer, is_correct) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ddsd', $user_id, $task_id, $answer, $is_correct ? 1 : 0);
    $query = $stmt->execute();
    $query->get_result();
}