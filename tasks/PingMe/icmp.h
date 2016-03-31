#ifndef _ICMP_H
#define _ICMP_H
#include <stdint.h>

typedef struct {
	uint8_t type;
	uint8_t code;
	uint16_t checksum;
	uint16_t id;
	uint16_t sequence;
	uint8_t payload[1];
} icmp;

#endif
