import os

with open('ciphers') as f:
    ciphers = [s.split() for s in f.readlines()]
for i, cipher in enumerate(ciphers):
    command = "openssl enc -e {0} -k {1} -in {2} -out {3}".format(cipher[0], cipher[1], i, i+1)
    os.system(command)