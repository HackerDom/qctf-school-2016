#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from socket import socket


def main():
    listen()

def listen():
    pass

def work(client):    
    data = b'\x00'
    client.send(b'Lynx Cipher service.\nTry to crack it:' +\
                ciph_flag()+b'\nEnter your data:\n')
    while data:
        try:в
            data = client.recv(65545)[:-1]
            if data:
                client.send(transponate(data)+b'\n')
            else:
                break
        except:
            break
    client.close()

def ciph_flag():
    flag = b'QCTF_d8e3c6b9ccb2b787dc3aa878dee3a1ff'
    return transponate(flag)

def transponate(data):
    transponData = []
    for i in range(0,len(data),8):
        octet = data[i:i+8] + b"\x00\x00\x00\x00\x00\x00\x00\x00"[:8-len(data[i:i+8])]
        bytematrix = generate_binary_matrix(octet)
        # print_matrix(bytematrix)
        transponMatrix = []
        for y in range(8):
            transponMatrix.append([])
            for x in range(8):
                transponMatrix[y].append(bytematrix[7-x][y])
        byteArr = []
        for i in range(8):
            charbits = []
            for j in range(8):
                charbits.append(transponMatrix[j][i])
            byteArr.append(int(''.join(charbits),2))
        result = bytes(byteArr)
        transponData.append(result)
    return b''.join(transponData)
        

def print_matrix(matrix):
    for x in range(8):
        for y in range(8):
            print(matrix[x][y],end=' ')
        print('')
    print('')


def generate_binary_matrix(bytestring):
    bytemap = []
    for i in range(8):
        bytemap.append([])
        for j in range(8):
            bytemap[i].append('\x00')
    for i in range(len(bytestring)):
        bitstring = "00000000"[:8-len(bin(bytestring[i])[2:])] + bin(bytestring[i])[2:]
        for j in range(len(bitstring)):
            bytemap[j][i]=bitstring[j]
    # for i in bytemap:
    #     print(i)
    return bytemap

if __name__ == '__main__':
    main()