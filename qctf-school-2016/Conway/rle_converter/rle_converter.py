#!/usr/bin/env python3

import argparse
import re


SUPPORTED_RULES = ['B3/S23']


class RLEFileReader:

    default_rule = 'B3/S23'
    token_regexp = re.compile(r'(\d+)?(b|o|\$|!)')
    header_regexp = re.compile(
        r'^x = (\d+), y = (\d+)(?:$|, rule = ([a-zA-Z0-9/]+)$)')

    def __init__(self, file_name):
        self.rle_file = open(file_name, 'r')
        header = self._get_next_line()
        try:
            self.x, self.y, self.rule = RLEFileReader._parse_header(header)
        except Exception:
            raise Exception('File format is wrong')
        if self.rule is None:
            self.rule = RLEFileReader.default_rule
        self._token_iter = None

    @staticmethod
    def _parse_header(header):
        match_obj = RLEFileReader.header_regexp.match(header)
        if match_obj is not None:
            x, y, rule = match_obj.groups()
            x = int(x)
            y = int(y)
            return x, y, rule

    def _get_next_line(self):
        while True:
            line = next(self.rle_file)
            # skip comments and addition info
            if line.startswith('#'):
                continue
            return line

    def _get_next_token(self):
        repeat = None
        token = None
        while True:
            try:
                repeat, token = next(self._token_iter).groups()
                break
            except (TypeError, StopIteration) as ex:
                self._token_iter = RLEFileReader.token_regexp.finditer(
                    self._get_next_line())
        repeat = 1 if repeat is None else int(repeat)
        return repeat, token

    def __iter__(self):
        return self

    def __next__(self):
        return self._get_next_token()


def rle_to_bin_convert(input_file, output_file):
    rle_file = RLEFileReader(input_file)
    if rle_file.rule not in SUPPORTED_RULES:
        raise Exception('{} rule not supported'.format(rle_file.rule))
    with open(output_file, 'w') as bin_file:
        current_line_length = 0
        for repeat, token in rle_file:
            if token == 'b':
                bin_file.write('0' * repeat)
                current_line_length += repeat
            elif token == 'o':
                bin_file.write('1' * repeat)
                current_line_length += repeat
            elif token == '$':
                bin_file.write('0' * (rle_file.x - current_line_length))
                bin_file.write('\n')
                for i in range(repeat - 1):
                    bin_file.write('0' * rle_file.x)
                    bin_file.write('\n')
                current_line_length = 0
            elif token == '!':
                bin_file.write('\n')
                break


def rle_from_line(line):
    rle = []
    for token in line:
        token = 'b' if token == '0' else 'o'
        if len(rle) == 0 or rle[-1][1] != token:
            rle.append([1, token])
        else:
            rle[-1][0] += 1
    if rle[-1][1] == 'b':
        return rle[:-1]
    return rle

def bin_to_rle_convert(input_file, output_file):
    with open(input_file, 'r') as bin_file:
        lines = bin_file.read().split()
    h = len(lines)
    w = len(lines[0])
    header = 'x = {}, y = {}, rule = {}\n'.format(w, h, 'B3/S23')
    with open(output_file, 'w') as rle_file:
        rle_file.write(header)
        current_state = 'null'
        for line in lines:
            rle = rle_from_line(line)
            for count, token in rle:
                if count == 1:
                    rle_file.write(token)
                else:
                    rle_file.write('{}{}'.format(count, token))
            rle_file.write('$\n')
        rle_file.write('!\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--rle_to_bin',
        help='convert .rle format to binary matrix',
        action='store_true')
    parser.add_argument(
        '--bin_to_rle',
        help='convert binary matrix to .rle file',
        action='store_true')
    parser.add_argument('input_file', help='Input file')
    parser.add_argument('output_file', help='Output file')
    args = parser.parse_args()
    if args.bin_to_rle:
        bin_to_rle_convert(args.input_file, args.output_file)
    elif args.rle_to_bin:
        rle_to_bin_convert(args.input_file, args.output_file)
    else:
        print('Task (--bin_to_rle/--rle_to_bin) not specified.'
              ' Use --help for more information')

