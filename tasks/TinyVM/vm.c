// Compile: gcc -std=c99 -s -O1 vm.c

char program[] = "62G212E3C3P3K0N1>2C3N21182G0;1E0D180R1Q1D3:2=073:1@3;073M3T0E1D1Q0A0K023S1G3M350:1I1H3N3Q0>0A3E2M122";
char magic[] = { 81, 63, 117, 70, 95, 103, 0, 208, 50, 54, 2, 25, 102, 49, 3, 101, 96, 196, 99, 196, 181, 23, 55, 14, 112, 25, 56, 50, 48, 231, 50, 102, 110, 24, 77, 28, 55 };
int program_len = sizeof(program);

int main(void) {
	printf("Welcome to TinyVM! Type your password:\n");
	char input[38];
	scanf("%37s", &input);

	for(int i=0; i<program_len; i++){
		int addr = program[i] - '0';
		i++;
		int command = program[i] - '0';
		switch(command){
			case 0:
				input[addr]++;
				break;
			case 1:
				input[addr] ^= 47;
				break;
			case 2:
				input[addr] -= 51;
				break;
			case 3:
				input[addr] *= 2;
				break;
		}
	}

	int ok = 1;
	for(int i = 0; i<37; i++){
		if (input[i] != magic[i])
			ok = 0;
	}

	if (ok){
		printf("Success! Flag is your password");
	} else {
		printf("Wrong");
	}

	return 0;
}
