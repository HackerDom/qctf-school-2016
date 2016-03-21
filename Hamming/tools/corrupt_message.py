#!/usr/bin/env python3

import random
with open('original_message.bin', 'rb') as message_file:
    message = bytearray(message_file.read())

i = 4*8 + 15 * 200  # skip size and header of image
while i + 15 < len(message) * 8:
    shift = random.randint(0, 14)
    byte_index = (i + shift) >> 3
    bit_index = (i + shift) & 7
    message[byte_index] ^= (1 << (7 - bit_index))
    i += 15

with open('message.bin', 'wb') as message_file:
    message_file.write(message)
