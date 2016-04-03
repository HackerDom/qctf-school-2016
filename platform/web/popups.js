var is_scoreboard_open = false;

function hidePopup() {
    $('.popup').html('');
    $('.popup__background').hide();
}

function showPopup($popup) {
    $('.popup').html('');
    $('.popup__background').show();
    var $clone = $popup.clone(true);
    $clone.show().appendTo('.popup');
    if ($popup.hasClass('popup__wide'))
        $('.popup').addClass('popup__wide');
    else
        $('.popup').removeClass('popup__wide');
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
                        alert(data.message);
                    }
                });
            });

        } else {
            alert(data.message);
        }
    });
}

function showScoreboard() {
    if (is_scoreboard_open) {
        hidePopup();
        is_scoreboard_open = false;
    } else {
        is_scoreboard_open = true;
        $.get('scoreboard.php', function (data) {
            $('#popup__scoreboard').html(data);
            showPopup($('#popup__scoreboard'));
            $('.menu a:first-child').text('Закрыть').click(function () {
                $(this).text('Текущие результаты');
            });
        });
    }
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
                alert('Неправильный пароль :-(  Возможно, тур ещё не начался, подождите.');
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
    if (show_scoreboard_on_start)
        showScoreboard();
    else
        showPopup($('#popup__welcome'));

    $('.popup__background').click(function() {
        if ($('.popup').find('.closable').length)
            hidePopup();
    });
});