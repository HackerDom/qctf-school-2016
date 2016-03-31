#!/usr/bin/env python3

import hashlib
import hamming
import sys


decoder = hamming.HammingDecoder(15, 11)
with open(sys.argv[1], 'rb') as input_file:
    data = input_file.read()
file_size = int.from_bytes(data[:4], 'little')
coded_message = data[4:]
decoded_message = decoder.decode_msg(coded_message)[:file_size]
print('QCTF_' + hashlib.md5(decoded_message).hexdigest())
