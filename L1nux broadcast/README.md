L1nux broadcast
======
> Что-то тут есть... Определенно... Я чувствую... Оно витает в пространстве!

Описание
--------
Задание представляет из себя программу, которая отсылает в нужном порядке всем процессам unix-сигналы, в порядке которых зашит ключ.

WriteUp
-------
Требуется написать обработчик нужных сигналов и собрать их.

По названию задания и имени процесса, отсылающего сигналы, догадываемся, что мы работаем с сигналами. Теперь нам требуется определить, какие сигналы отсылаются. Запускаем любую нашу программу, которая работает не менее нескольких секунд, и замечаем, что она успешно отработала. Можно сделать вывод, что используются сигналы, стандартный обработчик которых не завершает приложение. Гуглим. Таких всего 2. Пишем свой обработчик этих сигналов. Представим сигналы как порядок бит. Соберем их в последовательность 0 и 1 и преобразуем в ASCII. Получили флаг "QCTF_2aba458cf0384b6545f4b14ce6390572".