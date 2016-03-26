#!/usr/bin/env python3
import os
import re
import time

__author__ = 'Trofimov Igor'

GROUP = 'larpy'
KEY = 'QCTF_2aba458cf0384b6545f4b14ce6390572'
BINARY_KEY = ''.join([format(ord(symbol), 'b').rjust(8, '0') for symbol in KEY])
PID_REGEXP = re.compile(r'^[ ]*(\d+) ', re.MULTILINE)


def send(number) -> None:
    try:
        for pid in PID_REGEXP.findall(os.popen('ps -g {0}'.format(GROUP)).read()):
            # Хитро отправляем 2 вида сигналов ^^
            # number 0 или 1
            os.kill(int(pid), 17+int(number)*6)
    except ProcessLookupError:
        pass


def main() -> None:
    while True:
        for number in BINARY_KEY:
            time.sleep(1)
            send(number)


if __name__ == '__main__':
    print('Started...')
    main()
