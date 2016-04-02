#!/usr/bin/python3

import multiprocessing as mp
import socket


def proc(conn):
    data = conn.recv(1024).decode('utf8')
    try:
        res = str(eval(data, {'__builtins__': {}})).encode('utf8')
    except Exception as e:
        res = str(e).encode('utf8')

    conn.send(res)


if __name__ == '__main__':
    sock = socket.socket()
    sock.bind(('', 1337))
    sock.listen(5)

    while True:
        conn, addr = sock.accept()
        mp.Process(target=proc, args=(conn, )).start()
        conn.close()
