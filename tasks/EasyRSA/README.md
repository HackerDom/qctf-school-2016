EasyRSA
=======

> На базе наших заклятых врагов была обнаружена очень важная для нас информация.
> Мы отправили туда нашего суперагента, но его взяли в плен. Однако, он успел
> отправить нам это фото.

Flag
----
```
QCTF_4751cf56c3318a07be31555f2ad05978
```

Описание
--------
Участнику выдается файл с зашифрованным с помощью публичного RSA-ключа сообщением и фото
приватного ключа. Необходимо перепечатать/распознать ключ и расшифровать сообщение с флагом.
Однако, на фотографии закрыты по байту от модуля и приватной экпоненты, их придется перебрать.

Файлы
-----
1. **message.txt** - сообщение  сфлагом
2. **build.sh** - скрипт, зашифровывающий message.txt
3. **cipher** - зашифрованное сообщение. **Выдается участникам.**
4. **flag.txt** - файл с флагом
5. **key** - приватный RSA-ключ
6. **key.pub** - публичный RSA-ключ
7. **key_photo.jpg** - фото ключа. **Выдается участникам.**
8. **solution.py** - возможно решение на `python`
9. **description.txt** - описание задания для участников

Ссылки
------
1. [RSA](https://ru.wikipedia.org/wiki/RSA)