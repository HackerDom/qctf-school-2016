import random

with open('ciphers') as f:
    ciphers = [s.split() for s in f.readlines()]
    random.shuffle(ciphers)
    with open('shuffled_ciphers', 'w') as t:
        for cipher in ciphers:
            t.write(" ".join(cipher) + "\n")