/*
 * Hamming-(15, 11) implementation
 */

#include <stdio.h>
#include <stdlib.h>

const int INITIAL_SIZE = 1024;
const int BUFFER_SIZE = 128;


typedef struct {
	void *buffer;
	size_t buffer_size;
	size_t put_bit_index;
} hamming_code;


void finalize();
void hamming_code_put_byte(hamming_code *code, unsigned char byte);
void hamming_code_put_bit(hamming_code *code, unsigned char bit);
void hamming_code_set_bit(const hamming_code *code, size_t index, unsigned char bit);
unsigned char hamming_code_get_bit(const hamming_code *code, size_t index);
void hamming_code_add_padding(hamming_code *code);
void hamming_code_realloc_buffer(hamming_code *code);
void hamming_code_add_parity_bits(hamming_code *code);

FILE *input_file, *output_file;
hamming_code code;


int main(int argc, char **argv) {
	atexit(finalize);
	unsigned char buffer[BUFFER_SIZE];
	if(argc != 3) {
		fprintf(stderr, "Usage: %s file_to_encode output_file\n", argv[0]);
		exit(-1);
	}

	FILE *input_file = fopen(argv[1], "rb");
	if(input_file == NULL) {
		fprintf(stderr, "%s doesn't exist\n", argv[1]);
		exit(-1);
	}

	code.buffer = calloc(INITIAL_SIZE, sizeof(unsigned char));
	if(code.buffer == NULL) {
		fprintf(stderr, "Can't allocate %u bytes of memory\n", INITIAL_SIZE);
		exit(-1);
	}
	code.buffer_size = INITIAL_SIZE;
	code.put_bit_index = 0;
	size_t cnt, i, total_size = 0;

	while(!feof(input_file)) {
		cnt = fread(buffer, sizeof(unsigned char), BUFFER_SIZE, input_file);
		total_size += cnt;
		unsigned char *byte_ptr = buffer;
		for(i = 0; i < cnt; i++) {
			hamming_code_put_byte(&code, *byte_ptr++);
		}
	}
	hamming_code_add_padding(&code);
	hamming_code_add_parity_bits(&code);
	fclose(input_file);
	input_file = NULL;
	output_file = fopen(argv[2], "wb");
	if(!output_file) {
		fprintf(stderr, "%s doesn't exist\n", argv[2]);
		exit(-1);
	}
	// write original data length
	fwrite(&total_size, sizeof(size_t), 1, output_file);
	size_t buffer_length = (code.put_bit_index + 7) >> 3;
	fwrite(code.buffer, sizeof(unsigned char), buffer_length, output_file);
	fclose(output_file);
	output_file = NULL;
	return 0;
}


void hamming_code_put_byte(hamming_code *code, unsigned char byte) {
	unsigned char mask;
	for(mask = (1 << 7); mask != 0; mask >>= 1) {
		hamming_code_put_bit(code, byte & mask);
	}
}

void hamming_code_put_bit(hamming_code *code, unsigned char bit) {
	hamming_code_realloc_buffer(code);
	// calculate position of bit in current block of 15 bit
	size_t block_pos = code->put_bit_index % 15;
	// skip parity bits 0, 1, 3 and 7
	while(block_pos <= 1 || block_pos == 3 || block_pos == 7) {
	    hamming_code_set_bit(code, code->put_bit_index, 0);
		code->put_bit_index++;
		block_pos++;
	}
	hamming_code_set_bit(code, code->put_bit_index, bit);
	code->put_bit_index++;
}

void hamming_code_realloc_buffer(hamming_code *code) {
	size_t current_buffer_size = (code->put_bit_index + 7) >> 3;
	if(current_buffer_size > code->buffer_size) {
		void *new_buffer_ptr = realloc(code->buffer, code->buffer_size * 2);
		if(!new_buffer_ptr) {
			fprintf(stderr, "Can't realloc %d bytes of memory\n", code->buffer_size * 2);
			exit(-1);
		}
		code->buffer = new_buffer_ptr;
		code->buffer_size *= 2;
	}
}

void hamming_code_set_bit(const hamming_code *code, size_t index, unsigned char bit) {
	size_t byte_index = index >> 3;
	size_t bit_index = index & 7;
	unsigned char *buffer = code->buffer;
	if(bit) {
		buffer[byte_index] |= (1 << (7 - bit_index));
	} else {
		buffer[byte_index] &= ~(1 << (7 - bit_index));
	}
}

unsigned char hamming_code_get_bit(const hamming_code *code, size_t index) {
	size_t byte_index = index >> 3;
	size_t bit_index = index & 7;
	unsigned char *buffer = code->buffer;
	return (buffer[byte_index] & (1 << (7 - bit_index))) >> (7 - bit_index);
}

void hamming_code_add_padding(hamming_code *code) {
	if(code->put_bit_index % 15 != 0) {
		size_t i, old_index = code->put_bit_index,
			   ext_bits = 15 - code->put_bit_index % 15;
		code->put_bit_index += ext_bits;
		hamming_code_realloc_buffer(code);
		for(i = old_index; i < code->put_bit_index; i++) {
			hamming_code_set_bit(code, i, 0);
		}
	}
}

void hamming_code_add_parity_bits(hamming_code *code) {
	size_t i, j;
	unsigned int sum;

	for(i = 0; i < code->put_bit_index; i += 15) {

		// bit 0 -> sum of 0, 2, 4, ...
		sum = 0;
		for(j = 0; j < 15; j += 2) {
			sum += hamming_code_get_bit(code, i + j);
		}
		hamming_code_set_bit(code, i, sum & 1);

		// bit 1 -> sum of 1, 2, 5, 6, ...
		sum = 0;
		for(j = 1; j < 15; j += 4) {
			sum += hamming_code_get_bit(code, i + j) +
				hamming_code_get_bit(code, i + j + 1);
		}
		hamming_code_set_bit(code, i + 1, sum & 1);
		
		// bit 3 -> sum of 3, 4, 5, 6, 11, 12, 13, 14
		sum = 0;
		for(j = 3; j < 15; j += 8) {
			sum += hamming_code_get_bit(code, i + j) +
				hamming_code_get_bit(code, i + j + 1) +
				hamming_code_get_bit(code, i + j + 2) +
				hamming_code_get_bit(code, i + j + 3);
		}
		hamming_code_set_bit(code, i + 3, sum & 1);

		// bit 7 -> 7, 8, 9, ...
		sum = 0;
		for(j = 7; j < 15; j++) {
			sum += hamming_code_get_bit(code, i + j);
		}
		hamming_code_set_bit(code, i + 7, sum & 1);

	}
}

void finalize() {
	if(code.buffer) {
		free(code.buffer);
	}
	if(input_file) {
		fclose(input_file);
	}
	if(output_file) {
		fclose(output_file);
	}
}
