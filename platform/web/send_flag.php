<?php

    require_once 'session.php';
    require_once 'db.php';

    if (! array_key_exists('task_id', $_GET))
    {
        echo json_encode(['status' => 'failed', 'message' => 'Specify task_id']);
        exit;
    }

    if (! array_key_exists('flag', $_GET))
    {
        echo json_encode(['status' => 'failed', 'message' => 'Specify the flag']);
        exit;
    }

    $task_id = (int) $_GET['task_id'];
    $flag = $_GET['flag'];

    if ($_SESSION['user_id'] === false)
    {
        echo json_encode(['status' => 'failed', 'message' => 'You are not authorized']);
        exit;
    }

    $task = get_task($task_id);

    if ($task === false)
    {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid task id']);
        exit;
    }

    $is_correct = $task['flag'] == $flag;
    create_submission($_SESSION['user_id'], $task_id, $flag, $is_correct);

    echo json_encode(['status' => 'ok', 'is_correct' => $is_correct]);    
?>