<?php
include 'db.php';

function get_clean_input($param){
    global $mysqli;
    return $mysqli->real_escape_string($_REQUEST[$param]);
}

if (isset($_REQUEST['serial'])){
    $serial = get_clean_input('serial');
    $username = get_clean_input('username');

    if (strlen($serial) > 19){
        $serial = substr($serial, 0, 19);
    }

    $query = "SELECT * FROM codes WHERE serial='".$serial."' AND username='".$username."'";
    $result = $mysqli->query($query);
    if ($result){
        if ($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $license_key = $row["license_key"];
        } else {
            $error = "Неверный серийный номер";
        }
    } else {
        $error = $mysqli->error;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Сервер лицензий</title>
        <!-- Bootstrap -->
        <link href="./static/bootstrap.min.css" rel="stylesheet">
    </head>
<body>
    <div class="container">
        <div class="page-header">
            <h3>Получить лицензионный ключ</h3>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Введите ваши регистрационные данные:</h3>
                    </div>
                    <div class="panel-body">
                        
                        <?php
                        if (isset($error)){
                            echo '<div class="alert alert-danger" role="alert"><strong>Ошибка: </strong>'.$error.'</div>';
                        }
                       ?>
                        
                        <form method="POST" action="index.php">
                            <div class="form-group">
                                <label>Серийный номер:</label>
                                <input type="text" class="form-control" name="serial" placeholder="0000-0000-0000-0000" maxlength="19">
                            </div>
                            <div class="form-group">
                                <label>Имя пользователя:</label>
                                <input type="text" class="form-control" name="username" placeholder="Иван Иванов">
                            </div>
                            <input type="submit" class="btn btn-success">
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <?php
        if (isset($license_key)){
            echo '<div class="well">License key: '.$license_key.'</div>';
        }
        ?>
    </div>
  </body>
</html>