$(document).ready(function(){
    function hidePopup() {
        $('.popup').html('');
        $('.popup__background').hide();
    }

    function showPopup($popup) {
        $('.popup').html('');
        $('.popup__background').show();
        $popup.clone(true).show().appendTo('.popup');
    }

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