#!/usr/bin/env python3
# -*- coding = utf-8 -*-
import re
from random import randint

def binary_view(string):
    bits = []
    for c in string:
        bitchar = bin(ord(c))[-1:]
        bits.append(bitchar)
    return ''.join(bits)

def binary(string):
    bits = []
    for c in string:
        bitchar = bin(ord(c))[2:]
        bits.append('00000000'[:8-len(bitchar)] + bitchar)
    return ''.join(bits)

def found(ip, binflag, textstack):
    # print(textstack)
    for word in words:
        binword = binary_view(word[:-1])
        if binword == binflag[ip:]:
            textstack.append(word[:-1])
            return textstack, True
        elif len(binword) < len(binflag[ip:]):
            if binword+'0' == binflag[ip:ip+len(binword)+1] and not randint(0,20):
                textstack.append(word[:-1])
                result = found(ip+len(binword)+1, binflag, textstack)
                if result[1]:
                    return result
                else:
                    textstack.pop()
                    continue
    return textstack, False




with open('words.txt','r', encoding='cp1251') as f:
    words = f.readlines()
flag = 'QCTF_6590c99538be6f02936286ed716bb050'
binflag = binary(flag)
# print(binflag)
print(' '.join(found(0, binflag, [])[0]))