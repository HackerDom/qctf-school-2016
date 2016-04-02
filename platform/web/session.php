<?php

session_start();

if (! array_key_exists('user_id', $_SESSION))
    $_SESSION['user_id'] = false;

?>