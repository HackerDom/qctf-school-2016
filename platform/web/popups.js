function hidePopup() {
    $('.popup').html('');
    $('.popup__background').hide();
}

function showPopup($popup) {
    $('.popup').html('');
    $('.popup__background').show();
    $popup.clone(true).show().appendTo('.popup');
}

function talk(task_id) {
    showPopup($('#popup__task'));
    $.getJSON('get_task.php?task_id=' + task_id, function(data) {
        if (data.status == 'ok') {
            var task = data.task;
            var $inner = $('.popup > div');
            $inner.html(task.html);
            $inner.prepend('<h2>' + task.title + '</h2>');
            
            var $file_links = $('<div class="files"></div>').appendTo($inner);
            for (var file in task.files) {
                var $file_link = $('<a href="' + task.files[file] + '" class="file" target="_blank"></a>').text(file);
                $file_link.appendTo($file_links);
            }

            if (! task.already_done) {
                var $input = $('<input type="text" name="flag" placeholder="Ваш ответ">').appendTo($inner);
                var $button = $('<div class="button_wrapper"><button>Отправить</button></div>').appendTo($inner);
            } else {
                $('<div class="status green">Вы уже решили это задание</div>').appendTo($inner);
            }

            $('.popup button').click(function() {
                var answer = $('.popup input').val()
                // TODO: urlencode
                $.getJSON('send_flag.php?task_id=' + task_id + '&flag=' + answer, function (data) {
                    if (data.status == 'ok') {
                        if (data.is_correct) {
                            $input.hide();
                            $button.hide();
                        }

                        var message = data.is_correct ? 'Поздравляем! +1 очко' : 'К сожалению, нет :-(';
                        var $status = $('<div class="status">' + message + '</div>')
                        $status.appendTo($inner);
                        setTimeout(function () {
                            $status.slideUp();
                        }, 2000);
                    } else {
                         // TODO
                    }
                });
            });

        } else {
            // TODO
        }
    });
}


$(document).ready(function(){
    $('#popup__welcome button').click(function() {
        showPopup($('#popup__login'));
    });

    $('#popup__login button').click(function() {
        var login = $('.popup input[name=login]').val();
        var password = $('.popup input[name=password]').val();
        $.post('auth.php', {
            'login': login,
            'password': password,
        }, function (data) {
            if (data.status != 'ok') {
                alert('Неправильный пароль :(');
            } else {
                showPopup($('#popup__loading'));
                $.getJSON('maze.txt', function (data) {
                    hidePopup();
                    map_loaded(data);
                });
            }
        }, 'json');
    });

    // By default
    showPopup($('#popup__welcome'));
});