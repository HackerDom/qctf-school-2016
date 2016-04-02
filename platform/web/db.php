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