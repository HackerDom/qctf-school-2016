#include <sys/types.h>
#include <sys/socket.h>
#include <linux/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "icmp.h"


#define IPHDR_SIZE 20
#define SRC_ADDR_OFFSET 12
#define DST_ADDR_OFFSET 16
/* SEQ_SECRET = 31337 in Big Endian */
#define SEQ_SECRET 0x697a
#define ICMP_ECHO_REQUEST 8
#define ICMP_ECHO_REPLAY 0


void handle_packet(int sock, unsigned char *buffer, size_t buffer_len,
		struct sockaddr *saddr, socklen_t slen);
void dump_icmp(icmp *icmp_packet, size_t size);
uint32_t internet_checksum(void *addr, size_t count);


const char password[] = "dAEcdW4eWzeuscyd";
const char flag[] = "QCTF_5e987c1dc08beb4dca5a6f9c9e912321";


int main() {
	unsigned char buf[4096];
	struct sockaddr saddr;
	socklen_t slen;
	size_t sz;
	int sock = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);

	if(sock == -1) {
		perror("socket");
		return -1;
	}

	for(;;) {
		sz = recvfrom(sock, buf, 4096, 0, &saddr, &slen);
		if(sz == -1) {
			perror("recv");
		}
		handle_packet(sock, buf, sz, &saddr, slen);
	}

	return 0;
}

void handle_packet(int sock, unsigned char *buffer, size_t buffer_len,
		struct sockaddr *saddr, socklen_t slen) {

	uint8_t response[256];
	icmp *icmp_packet;
	size_t icmp_packet_size;
	char *response_message;

#ifdef DEBUG
	uint8_t *src_addr;
#endif

	if(buffer_len < IPHDR_SIZE + sizeof(icmp))
		return;

	icmp_packet = (icmp *)(buffer + IPHDR_SIZE);
	icmp_packet_size = buffer_len - IPHDR_SIZE;

	if(icmp_packet_size > 128)
		return;

#ifdef DEBUG
	src_addr = (uint8_t *)(buffer + SRC_ADDR_OFFSET);
	printf("From: %u.%u.%u.%u\n",
			src_addr[0],
			src_addr[1],
			src_addr[2],
			src_addr[3]);
	dump_icmp(icmp_packet, icmp_packet_size);
#endif

	if(icmp_packet->type == ICMP_ECHO_REQUEST && icmp_packet->code == 0) {
		memset(response, 0, 256);
		memcpy(response, icmp_packet, icmp_packet_size);
		icmp_packet = (icmp *)response;
		icmp_packet->type = ICMP_ECHO_REPLAY;
		icmp_packet->checksum = 0;
		response_message = (char *)(response + icmp_packet_size);

		/* check sequence */
		if(icmp_packet->sequence != SEQ_SECRET) {
			strcpy(response_message, ">>> Sequence must be 31337");
		/* check payload */
		} else if(strncmp((char *)icmp_packet->payload, password, sizeof(password) - 1) != 0) {
			strcpy(response_message, ">>> Wrong password");
		/* send flag */
		} else {
			strcpy(response_message, ">>> Good work! You flag is ");
			strcat(response_message, flag);
		}
		icmp_packet->checksum = internet_checksum(response, 256);
		sendto(sock, response, sizeof(response), 0, saddr, slen);
	}

}

void dump_icmp(icmp *icmp_packet, size_t size) {
	size_t i;
	printf("Type: %02x\n", icmp_packet->type);
	printf("Code: %02x\n", icmp_packet->code);
	printf("Checksum: %04x\n", icmp_packet->checksum);
	printf("Identifier: %04x\n", icmp_packet->id);
	printf("Sequence number: %04x\n", icmp_packet->sequence);
	printf("Payload:\n");
	for(i = 0; i < size - sizeof(icmp); i++) {
		printf("%02x ", icmp_packet->payload[i]);
		if((i & 0xf) == 0xf) {
			putchar('\n');
		}
	}
	putchar('\n');
}


/* Source: RFC 1071 - Computing the Internet checksum */
uint32_t internet_checksum(void *addr, size_t count)
{
	/* Compute Internet Checksum for "count" bytes
	*         beginning at location "addr".
	*/
	uint32_t sum = 0, checksum;

	while( count > 1 )  {
		/*  This is the inner loop */
		sum += *(uint16_t *)addr;
		addr = (uint16_t *)addr + 1;
		count -= 2;
	}

	/*  Add left-over byte, if any */
	if( count > 0 )
		sum += * (uint8_t *) addr;

	/*  Fold 32-bit sum to 16 bits */
	while (sum>>16)
		sum = (sum & 0xffff) + (sum >> 16);

	checksum = ~sum;
	return checksum;
}
