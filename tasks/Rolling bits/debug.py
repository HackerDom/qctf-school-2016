from rolling_bit import transponate as transp
from hashlib import md5

def ciph(data, deep, curr=0):
    # if not curr:
    #     print(bytes(data),deep)
    if deep != curr:
        return ciph(transp(bytes(data)),deep,curr+1)
    else:
        # print(transp(bytes(data)))
        return transp(bytes(data))

tmp = b'''Hello, young hackers!
My name is Lynx and I show you my new cipher.
It's so simple but I like it because it seems so ingenious.
But if you read this text, you had crack my alghorithm.
Take your reward: QCTF_741286ccc21e4006febd0bcf02131be0.
Good luck in other tasks.'''
# tmp = 'QCTF_741286ccc21e4006febd0bcf02131be0'.encode()
current = []

file = open("flag","wb")
for i in range(0,len(tmp),8):
    current.append(ciph(tmp[i:i+8],i//8 % 4))
file.write(b''.join(current))
# print(b''.join(current))
# string = b'\xcd\\>\x08\xaf\x07\xf8\x00\x8cL\xc6\xc6\xc6l\x1cL\x00\xe1\xff\x1e\x00s\xb0Ad0bcf021\xd0\xa0\x10\x00\xc8\xf80\x00'
# for i in range(4):
#     print(ciph(string,i))
# print(ciph(string,0))