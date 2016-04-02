#!/usr/bin/env python3

import errno
import functools
import time
import tornado.ioloop
import tornado.gen
import socket
import random

@tornado.gen.coroutine
def handle_connection(conn,addr):

    flag = 'QCTF_27f4d00a79c959ac9e8e20512f9662d1'
    gen = QCTF(flag)
    t1 = time.time()
    filereadTimer = random.randint(30,50)

    while 1:

        if time.time()-t1>filereadTimer:

            f = open('defQCTF',mode='r')
            lines = f.readlines()
            f.close()

            for i in lines:
                for j in i:
                    conn.send((j.encode()))
                    yield tornado.gen.sleep(0.1)

            t1 = time.time()
            filereadTimer = random.randint(30,50)

        conn.send((gen.__next__()).encode())
        yield tornado.gen.sleep(0.1)

def QCTF(flag):

    while 1:

        z = random.randint(0x4,0x23) # flag[a] - символ из md5 или '_'
        while ord(flag[z])-0x40 < 33: # ord(flag[a]) - ord('f') < 0
            z = random.randint(0x4,0x23) # flag[a] == a-f

        if z%2:
            z+=1

        for i in range(0,len(flag)):
            for j in range(0,random.randint(1,ord(flag[z]))):

                y = bytearray(random.randint(0,0x11))


                z = random.randint(0x4,0x23) # символ из md5
                while ord(flag[z])-0x40 < 33: # a-f
                    z = random.randint(0x4,0x23)

                if ord(flag[z])%2: # "случайно" выбираем верхний или нижний регистр
                    x = 0x0d # 0x0d*5 = ord("A")
                else:
                    x = 0x15 # 0x15*5 = ord("i")

                yield chr(x*5 + len(y)) # A-R i-z

            if flag[i]!='_':
                yield flag[i]
            else:
                continue

def connection_ready(sock, fd, events):
    while True:
        try:
            connection, address = sock.accept()
        except socket.error as e:
            if e.args[0] not in (errno.EWOULDBLOCK, errno.EAGAIN):
                raise
            return
        connection.setblocking(0)
        handle_connection(connection, address)

if __name__ == '__main__':
    port = 6000
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.setblocking(0)
    sock.bind(("", port))
    sock.listen(642) # 80*4 * 2     + 2

    io_loop = tornado.ioloop.IOLoop.current()
    callback = functools.partial(connection_ready, sock)
    io_loop.add_handler(sock.fileno(), callback, io_loop.READ)
    io_loop.start()