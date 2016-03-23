import socket

sock = socket.socket()
sock.bind(('', 1337))
sock.listen(5)

while True:
    conn, addr = sock.accept()
    data = conn.recv(1024)

    res = str(eval(data))
    conn.send(res.encode('utf8'))
    conn.close()
