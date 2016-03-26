#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5.QtCore import *

class LSB(QMainWindow):
    """docstring for LSB"""

    def __init__(self):
        super().__init__()
        self.text = ""
        self.initUI()

    def initUI(self):
        '''Docstring'''
        self.setFixedSize(640,200)
        self.textline = QLineEdit(self)
        self.textline.setGeometry(5, 5, 630,25)
        self.textline.textChanged[str].connect(self.gen_bit)

        self.bitline = QLabel(self)
        self.bitline.setGeometry(5,35, 630, 25)

        self.stegoline = QLabel(self)
        self.stegoline.setGeometry(5,65, 630, 25)
        self.stegoline.setText("lol")

        self.show()
    def gen_bit(self,text):
        self.text = text
        bits = []
        for i in self.text:
            bits.append(str(ord(i)%2))
        bitstr = ''.join(bits)
        self.bitline.setText(bitstr)
        self.gen_stego(bitstr)

    def gen_stego(self, bitstring):
        text = []
        for k in range(len(bitstring)):
            if (k + 1) % 8 == 0:
                text.append(chr(int(bitstring[k-7:k+1],2)))
            else:
                text.append('  ')
        self.stegoline.setText(''.join(text))


if __name__ == '__main__':
    APP = QApplication(sys.argv)
    ex = LSB()
    sys.exit(APP.exec_())
