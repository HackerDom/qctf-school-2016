<?php
    require_once 'session.php';
    require_once 'db.php';

    if (! array_key_exists('task_id', $_GET))
    {
        echo json_encode(['status' => 'failed', 'message' => 'Specify task_id']);
        exit;
    }

    $task_id = (int) $_GET['task_id'];

    if ($_SESSION['user_id'] === false)
    {
        echo json_encode(['status' => 'failed', 'message' => 'You are not authorized']);
        exit;
    }

    $stmt = $db->prepare('SELECT * FROM tasks WHERE id = ?');
    $stmt->bind_param('d', $task_id);
    $query = $stmt->execute();
    $task = fetch_one($stmt->get_result());

    if ($task === false)
    {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid task id']);
        exit;
    }

    # TODO: read task from file by its name
    echo json_encode(['status' => 'ok', 'task' => $task]);
?>