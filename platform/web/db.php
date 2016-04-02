<?php

function connect_to_database()
{
    $host = 'localhost';
    $user = 'platform';
    $password = 'zxfPkqe4NXsUlXWKfoNC'
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

function get_users()
{
    global $db;

    $query = $db->query('SELECT * FROM users');
    return fetch_all($query, 'id');
}

function get_task_keys($task_id)
{
    global $db;

    $query = $db->query('SELECT * FROM tasks_keys WHERE task_id = "'.$db->real_escape_string($task_id).'"');
    return fetch_all($query);
}

function get_user_keys($user_id)
{
    global db;

    $query = $db->query('SELECT key_id FROM users_keys WHERE user_id = "'.$db->real_escape_string($user_id).'"');
    return array_column(fetch_all($query), 'key_id');
}

function is_task_open_for_user($user_id, $task_id)
{
    $user_keys = get_user_keys($user_id);
    $task_keys = 
}