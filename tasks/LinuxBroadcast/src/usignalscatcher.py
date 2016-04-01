#!/usr/bin/env python3
import os
import signal

__author__ = 'Trofimov Igor'


def handler_17(*args) -> None:
    print(1)


def handler_23(*args) -> None:
    print(0)


def main() -> None:
    signal.signal(signal.SIGCHLD, handler_17)
    signal.signal(signal.SIGURG, handler_23)
    while True:
        signal.pause()


if __name__ == '__main__':
    print('PID: {0}'.format(os.getpid()))
    main()
