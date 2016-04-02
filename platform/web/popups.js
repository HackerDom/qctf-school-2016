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
            $inner.append('<input type="text" name="flag" placeholder="Ваш ответ">');
            $inner.append('<div class="button_wrapper"><button>Отправить</button></div>');
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