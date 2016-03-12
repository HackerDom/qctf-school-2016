import os, itertools

with open('shuffled_ciphers') as f:
    ciphers = [s.split() for s in f.readlines()]


for i in range(1, len(ciphers) + 1):
    for cipher in ciphers:
        os.system("echo good > err")
        command = "openssl enc -d {0} -k {1} -in phase{2} -out phase{3} 2>err".format(cipher[0], cipher[1], i, i + 1)
        os.system(command)
        with open('err') as e:
            if len(ciphers) == 1:
                error = ""
            else:
                error = e.read()
            if "bad" not in error:
                print(i, "[+]")
                ciphers.remove(cipher)
                break
with open('phase' + str(i + 1)) as f:
    print("Flag is :", f.read())
