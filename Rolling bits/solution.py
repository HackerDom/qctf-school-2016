from rolling_bit import transponate as transp
from hashlib import md5

def ciph(data, deep, curr=0):
    if deep != curr:
        return ciph(transp(bytes(data)),deep,curr+1)
    else:
        return bytes(data)

current = []

file = open("flag","rb")
tmp = file.read()
for i in range(0,len(tmp),8):
    current.append(ciph(tmp[i:i+8],(3-i//8)% 4))
# file.write(b''.join(current))
print(b''.join(current))