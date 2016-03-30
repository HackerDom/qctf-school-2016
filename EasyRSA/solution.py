#!/usr/bin/env python3

with open('cipher', 'rb') as cipher_file:
    ciphertext = cipher_file.read()

c = int.from_bytes(ciphertext, 'big')
e = 0x10001
n_corrupted = """
    00:dc:0e:9b:c6:86:e6:6f:b2:0b:23:5a:a6:25:7c:
    ff:15:ce:95:8e:7e:62:ae:89:f3:af:67:33:21:1f:
    dd:6e:44:19:62:a4:35:48:22:71:f4:2b:b9:3c:5a:
    22:82:3d:ed:b5:ae:76:e7:13:31:9a:f6:df:45:3c:
    10:66:01:d9:18:5e:21:aa:42:2b:04:05:24:33:f4:
    fd:be:4f:27:89:dd:aa:3f:6f:97:d4:58:70:67:cb:
    5a:b8:ec:64:ed:b0:0f:68:8f:f7:f3:5f:1e:98:d2:
    b8:41:53:ef:d3:13:6d:d2:d1:dd:55:f5:d6:da:21:
    %02x:16:f2:5a:7b:73:94:6a:d2:bb:80:1b:be:c9:f3:
    a1:32:a9:95:0e:96:51:63:e7:b5:8c:3b:62:2e:45:
    ff:76:85:c7:e6:53:2b:4d:cd:33:6c:d4:df:5d:88:
    fe:e0:9b:37:0c:01:56:74:4d:30:1d:d2:16:5b:b0:
    c6:da:0b:a5:ce:51:7b:b2:e7:3e:20:f5:0f:10:b5:
    f7:6f:b4:a8:d4:9a:23:84:59:d8:11:14:0e:10:71:
    48:4b:44:2e:ff:46:3a:44:11:9b:b6:a0:fe:3b:3d:
    fd:11:ea:7a:27:e5:78:c5:29:43:2a:e3:87:39:f1:
    55:00:3a:b3:d5:90:12:73:bd:f7:54:8f:d9:e7:9e:
    b8:71
"""
d_corrupted = """
    70:56:44:cf:a4:2e:1e:f7:15:18:87:3e:2a:05:15:
    73:5c:72:9c:bb:88:44:f1:c7:a4:d3:5a:16:9e:dd:
    bb:5c:a8:58:e2:db:10:68:05:24:50:ed:cf:11:74:
    6c:68:90:e1:1e:9f:34:77:67:eb:63:fb:b6:ac:62:
    f2:b0:1e:d3:81:ba:4d:e0:59:75:43:ea:a7:5b:79:
    ed:9d:1a:e2:16:76:c2:cb:85:06:b1:df:30:1d:6f:
    c2:d7:6a:ee:ab:e2:31:ce:cd:15:40:89:ae:1a:64:
    55:75:34:08:dc:f2:43:9d:3f:10:92:df:8b:9b:99:
    dc:8c:fc:03:e9:8c:ea:ba:96:ad:96:20:92:6c:2b:
    6e:b6:d1:09:d2:6d:f4:52:2e:67:5a:8c:4b:09:1e:
    92:f7:2c:df:a9:fd:31:6b:fa:50:d5:e2:c1:24:f8:
    a4:b3:9d:f0:bb:9a:ad:53:6f:ba:c1:de:64:2e:2c:
    7b:87:05:11:a2:68:e0:ba:26:19:b3:83:98:10:b5:
    bd:e7:de:2a:bc:8c:a6:4d:35:b2:7e:19:ae:48:1e:
    69:58:7f:a2:d5:22:7c:7a:ea:1f:d9:a9:c8:6b:c4:
    b1:47:cd:28:2a:97:dd:b9:fb:ec:64:ef:a8:1f:c6:
    c8:48:cb:4d:1d:87:1c:0b:29:ef:91:12:04:da:%02x:
    c1

"""

import time

n_corrupted = ''.join(map(lambda line: line.replace(':', ''), n_corrupted.split()))
d_corrupted = ''.join(map(lambda line: line.replace(':', ''), d_corrupted.split()))

for i in range(0x100):
    n = int(n_corrupted % i, 16)
    print('{}% complete'.format(i * 100 / 256))
    for j in range(0x100):
        d = int(d_corrupted % j, 16)
        m = pow(c, d, n)
        message = m.to_bytes(256, 'big')
        if message.find(b'QCTF_') != -1:
            print(message)
            exit()
