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

    $task = get_task($task_id);

    if ($task === false)
    {
        echo json_encode(['status' => 'failed', 'message' => 'Invalid task id']);
        exit;
    }

    $task_html = file_get_contents('tasks/' . $task['name'] . '/task.html');
    $task_files = scandir('tasks/' . $task['name'] . '/user');

    $files = [];
    foreach ($task_files as $task_file)
    {
        if ($task_file == '.' || $task_file == '..')
            continue;
        $files[$task_file] = '/files/' . $task_id . '/' . $task_file;
    }

    $already_done = is_already_done($_SESSION['user_id'], $task_id);
    echo json_encode(['status' => 'ok', 'task' => ['title' => 'Hello world',
                                                   'html' => $task_html,
                                                   'files' => $files,
                                                   'already_done' => $already_done]]);
?>