class HammingDecoder:

    def __init__(self, n, k):
        m = n - k
        if 2**m - 1 != n or 2**m - m - 1 != k:
            raise Exception('unsupportedd hamming code')
        self.n = n
        self.k = k

    def encode_block(self, msg):
        if len(msg) != self.k:
            raise Exception('length of message mast be {}'.format(self.k))
        out = []
        parity_iterator = iter(self.calculate_parity_bits(msg))
        msg_iterator = iter(msg)
        for i in range(1, self.n + 1):
            if i & (i - 1) == 0:
                out.append(next(parity_iterator))
            else:
                out.append(next(msg_iterator))
        return out

    def calculate_parity_bits(self, msg):
        parity_bits = []
        temp = []
        msg_iterator = iter(msg)
        for i in range(1, self.n + 1):
            if i & (i - 1) == 0:
                temp.append(0)
            else:
                temp.append(next(msg_iterator))
        for i in range(self.n - self.k):
            s = 0
            for j in range(2**i - 1, self.n, 2**(i + 1)):
                for k in range(2**i):
                    s ^= temp[j + k]
            parity_bits.append(s)
        return parity_bits

    def decode_block(self, msg):
        if len(msg) != self.n:
            raise Exception('length of message must be {}'.format(self.n))
        out = []
        encoded_parity_bits = []
        for i in range(1, self.n + 1):
            if i & (i - 1) != 0:
                out.append(msg[i - 1])
            else:
                encoded_parity_bits.append(msg[i - 1])
        parity_bits = self.calculate_parity_bits(out)
        if parity_bits != encoded_parity_bits:
            out = []
            err_pos = 0
            for i in range(self.n - self.k):
                if parity_bits[i] != encoded_parity_bits[i]:
                    err_pos += 2**i
            for i in range(1, self.n + 1):
                if i & (i - 1) != 0:
                    if i == err_pos:
                        out.append(msg[i - 1] ^ 1)
                    else:
                        out.append(msg[i - 1])
        return out

    def decode(self, msg):
        piece_nth = 0
        L = self.n
        result = []
        while True:
            piece = msg[piece_nth*L:piece_nth*L + L]
            if len(piece) < L:
                break
            result.extend(self.decode_block(piece))
            piece_nth += 1
        return result

    def decode_msg(self, msg):
        binary = list(map(int, ''.join([format(x, 'b').zfill(8) for x in msg])))
        decoded_binary = self.decode(binary)
        i = 0
        result = bytearray()
        while i < len(decoded_binary):
            result.append(int(''.join(map(str, decoded_binary[i:i+8])), 2))
            i += 8
        return result


