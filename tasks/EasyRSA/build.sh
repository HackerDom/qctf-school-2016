#!/bin/sh

openssl rsautl -encrypt -in message.txt -inkey key.pub -pubin -out cipher
