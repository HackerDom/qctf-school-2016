#!/bin/bash

if [ $# -lt 1 ]; then
	echo Usage: $0 image_file
	exit
fi

echo "Start building"
echo

echo " 1) Prepare image (add description text)"
./tools/prepare_image.py $1 target_image.bmp
if [ $? -ne 0 ]; then
	echo "[-] Fail"
	exit
else
	echo "[+] Success"
fi

md5_hash=$(md5sum -b target_image.bmp | cut -f1 -d\ )
flag=QCTF_$md5_hash
echo $flag > flag.txt
echo "[!] Flag is" $flag "(see flag.txt file)"

echo " 2) Encode image with Hamming-(15, 11)"
./tools/encoder/encoder target_image.bmp original_message.bin
if [ $? -ne 0 ]; then
	echo "[-] Fail"
	exit
else
	echo "[+] Success"
fi

echo " 3) Corrupt encoded image"
./tools/corrupt_message.py original_message.bin message.bin
if [ $? -ne 0 ]; then
	echo "[-] Fail"
	exit
else
	echo "[+] Success"
fi

echo " 4) Check corrupted image"
solution=$(./tools/check.py message.bin)
if [[ "$flag" != "$solution" ]]; then
	echo "[-] Different flags!"
	exit
else
    echo "[+] Success"
fi

echo " 5) Garbage collection"
rm target_image.bmp &&
rm original_message.bin
if [ $? -ne 0 ]; then
	echo "[-] Fail"
	exit
else
	echo "[+] Success"
fi

echo
echo "Building complete!"
