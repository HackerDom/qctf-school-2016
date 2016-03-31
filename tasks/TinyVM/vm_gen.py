import random

flag = "QCTF_f34d657f05e0ac1b279868002cf79b36"

operations = [
	lambda x: x + 1,
	lambda x: (x ^ 47) % 256,
	lambda x: x - 51,
	lambda x: x * 2
]

result = [ord(c) for c in flag]

program = ""

for i in range(50):
	addr = random.randint(0, len(result)-1)
	command = random.randint(0, len(operations)-1)
	# Avoid overflow
	if result[addr] > 250 and command == 0:
		command = 1
	if result[addr] < 51 and command == 2:
		command = 0
	if result[addr] > 127 and command == 3:
		command = 2

	program += chr(ord("0") + addr) + str(command)
	result[addr] = operations[command](result[addr])


magic = ", ".join([str(v) for v in result])

print('char program[] = "{}";'.format(program))
print("char magic[] = {{ {} }};".format(magic))