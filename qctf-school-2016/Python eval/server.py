#!/usr/bin/python3

import argparse
import multiprocessing as mp
import queue
import socket
import sys
import threading


def create_parser():
    parser = argparse.ArgumentParser(
        prog='Python eval',
        epilog='Matveev Anton. QCTF School 2016.')

    parser.add_argument('-host', '--host',
                        default=socket.gethostname(),
                        type=str,
                        help='Host address')

    parser.add_argument('-p', '--port',
                        default=1337,
                        type=int,
                        help='Port')

    parser.add_argument('-cpu', '--cpu',
                        default=16,
                        type=int,
                        help='Number of processes')

    parser.add_argument('-t', '--timeout',
                        default=3,
                        type=int,
                        help='Process live')

    parser.add_argument('-l', '--blacklist',
                        default='blacklist.txt',
                        type=str,
                        help='File with bad words')

    return parser


def check_data(data):
    for word in blacklist:
        if word in data:
            return word


def control():
    while True:
        if len(during) < nCPU:
            conn = connected.get()
            threading.Thread(target=handle, args=(conn, )).start()


def handle(conn):
    data = conn.recv(1024).decode('utf8')
    check = check_data(data)
    if check:
        conn.send(('"%s" is Not Allowed!' % check).encode('utf8'))
        conn.close()
        return

    p = mp.Process(target=proc, args=(conn, data))
    during.add(p)
    p.start()

    p.join(timeout)
    if p.is_alive():
        try:
            p.terminate()
            conn.send(b'TimeOut Error!')
        except:
            pass

    conn.close()
    during.remove(p)


def proc(conn, data):
    try:
        res = str(eval(data, {})).encode('utf8')
    except Exception as e:
        res = str(e).encode('utf8')

    conn.send(res)
    conn.close()


if __name__ == '__main__':
    p = create_parser()
    parser = p.parse_args(sys.argv[1:])

    try:
        fblacklist = parser.blacklist
        blacklist = open(fblacklist).read().split()
    except Exception as e:
        print(e)
        sys.exit(1)

    timeout = parser.timeout
    nCPU = parser.cpu
    hostname = parser.host
    hostaddr = socket.gethostbyname(hostname)
    port = parser.port

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    except socket.error as e:
        print('Error, creating socket %s' % e)
        sys.exit(1)

    sock.bind((hostname, port))
    sock.listen(100)

    print('Server[%s : %s] listening on port: %d' % (hostname, hostaddr, port))

    connected = queue.Queue()
    during = set()

    threading.Thread(target=control).start()

    while True:
        try:
            conn, addr = sock.accept()
            print("Client connected [%s]" % ':'.join(map(str, addr)))
            connected.put(conn)
        except KeyboardInterrupt:
            print('Server Stopped')
            try:
                conn.close()
            except:
                pass

            for p in during:
                p.terminate()

            sys.exit(1)
