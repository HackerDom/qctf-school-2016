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
                        default=socket.gethostbyname(socket.gethostname()),
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
            conn, addr = connected.get()
            threading.Thread(target=handle, args=(conn, addr)).start()


def handle(conn, addr):
    conn.settimeout(3)
    try:
        data = conn.recv(1024).decode('utf8')
        check = check_data(data)
        if check:
            conn.send(('"%s" is Not Allowed!' % check).encode('utf8'))
        else:
            p = mp.Process(target=proc, args=(conn, data))
            during.add(p)
            p.start()

            p.join(timeout)
            if p.is_alive():
                try:
                    p.terminate()
                    conn.send(b'TimeOut Error!')
                except:
                    print('Client [%s]: TimeOut: too long command execution' % ':'.join(map(str, addr)))

            print('Client [%s]: OK' % ':'.join(map(str, addr)))
            during.remove(p)
    except:
        print('Client [%s]: TimeOut: no data receive' % ':'.join(map(str, addr)))
    finally:
        conn.close()


def proc(conn, data):
    try:
        res = str(eval(data, {'__builtins__': {}})).encode('utf8')
    except Exception as e:
        res = str(e).encode('utf8')

    conn.send(res)


if __name__ == '__main__':
    p = create_parser()
    parser = p.parse_args(sys.argv[1:])

    try:
        blacklist = open(parser.blacklist).read().split()
    except Exception as e:
        print('Can\'t open "%s"' % parser.blacklist)
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
            print('Client connected [%s]' % ':'.join(map(str, addr)))
            connected.put((conn, addr))
        except KeyboardInterrupt:
            print('Server Stopped')
            try:
                conn.close()
            except:
                pass

            for p in during:
                p.terminate()

            sock.close()
            sys.exit(1)
