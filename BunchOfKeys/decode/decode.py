import os, itertools

with open('shuffled_ciphers') as f:
    ciphers = [s.split() for s in f.readlines()]


for i in range(1, len(ciphers) + 1):
    for cipher in ciphers:
        os.system("echo good > err")
        command = "openssl enc -d {0} -k {1} -in phase{2} -out phase{3} 2>/dev/null".format(cipher[0], cipher[1], i, i + 1)
        error = os.system(command)
        if error == 0:
            print(i, "[+]")
            ciphers.remove(cipher)
            break
with open('phase' + str(i + 1)) as f:
    print("Flag is :", f.read())
