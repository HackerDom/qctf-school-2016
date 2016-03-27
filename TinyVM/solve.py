program = "62G212E3C3P3K0N1>2C3N21182G0;1E0D180R1Q1D3:2=073:1@3;073M3T0E1D1Q0A0K023S1G3M350:1I1H3N3Q0>0A3E2M122"
bytes = "51 3F 75 46 5F 67 00 D0 32 36 02 19 66 31 03 65 60 C4 63 C4 B5 17 37 0E 70 19 38 32 30 E7 32 66 6E 18 4D 1C 37"

program = program[::-1]
bytes = [int(x, 16) for x in bytes.split()]

for i in range(0, len(program), 2):
	command, addr = int(program[i]), ord(program[i+1]) - ord("0")
	if command == 0:
		bytes[addr] -= 1
	if command == 1:
		bytes[addr] ^= 0x2f
	if command == 2:
		bytes[addr] += 0x33
	if command == 3:
		bytes[addr] >>= 1

print("".join([chr(x) for x in bytes]))