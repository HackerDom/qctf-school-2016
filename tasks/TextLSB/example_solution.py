s = 'bits prefer breeze chap ben deed specimen asleep buy ads buyer st kept blew bread ask fin coil un galaxy bush col agent bump fun captive big car collect dumb TV bow belt gum fit cordial ms aid bean ant skill brim collect anyhow bolt boy acid ay rpm due carlos blot ash bab bomb dr heels invest dr'
a = []
for i in s:
	a.append(str(ord(i)%2))
a = ''.join(a)
print(a)
for i in range(0,len(a),8):
	print(chr(int(a[i:i+8],2)),end='')
