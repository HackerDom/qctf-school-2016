#!/usr/bin/env python3

import random
import functools
import sys


patterns = [
    ('.v>.>.>^.^<.', 3),
    ('.', 1),
    ('.>.', 1),
    ('.>v.>v.>v.>v.', 3),
    ('.>^.>^.>v.>v.>^.>^.', 4)
]


IN_FILE = sys.argv[1]
OUT_FILE = sys.argv[2]
AMOUNT = 10000000
DIRS = '>^<v'
DIRECTIONS_VECTOR = ((1, 0), (0, 1), (-1, 0), (0, -1))


def read_file(file_name):
    matrix = []
    with open(file_name, 'r') as file:
        for line in file:
            line = line.replace('\n', '')
            if line:
                matrix.append(list(map(int, line)))
    h = len(matrix)
    w = len(matrix[0])
    return w, h, matrix


def write_file(file_name, matrix):
    with open(file_name, 'w') as file:
        for line in matrix:
            file.write(''.join(map(str, line)))
            file.write('\n')


def is_clear_rect(matrix, x_min, y_min, x_max, y_max):
    for i in range(y_min, y_max + 1):
        for j in range(x_min, x_max + 1):
            if 0 <= i < h and 0 <= j < w and matrix[i][j] == 1:
                return False
    return True


def apply_direction(x, y, direction, dirs):
    dir_idx = DIRS.index(direction)
    return x + dirs[dir_idx][0], y + dirs[dir_idx][1]


@functools.lru_cache(1 << 16)
def get_border_rect(pattern, dirs):
    x = y = 0
    x_min = x_max = 0
    y_min = y_max = 0
    for action in pattern:
        if action in DIRS:
            x, y = apply_direction(x, y, action, dirs)
        else:
            x_min = min(x, x_min)
            x_max = max(x, x_max)
            y_min = min(y, y_min)
            y_max = max(y, y_max)
    return x_min, y_min, x_max, y_max


def try_apply_pattern(matrix, w, h, pos_x, pos_y, pattern, direction_seed):
    pattern, cycles = pattern
    p_size = cycles + 1
    # shift list of directions
    dirs = DIRECTIONS_VECTOR[direction_seed:] + \
           DIRECTIONS_VECTOR[:direction_seed]
    # check possibility
    x_min, y_min, x_max, y_max = get_border_rect(pattern, dirs)
    if not (0 <= pos_x + x_min and 0 <= pos_y + y_min and
            pos_x + x_max < w and pos_y + y_max < h):
        return False
    if is_clear_rect(matrix,
                     pos_x + x_min - p_size, pos_y + y_min - p_size,
                     pos_x + x_max + p_size, pos_y + y_max + p_size):
        x = pos_x
        y = pos_y
        for action in pattern:
            if action in DIRS:
                x, y = apply_direction(x, y, action, dirs)
            else:
                matrix[y][x] = 1
        return True
    return False


if __name__ == '__main__':
    w, h, matrix = read_file(IN_FILE)
    n = 0
    for i in range(AMOUNT):
        x = random.randint(0, w)
        y = random.randint(0, h)
        direction = random.randint(0, 3)
        pattern = random.choice(patterns)
        if try_apply_pattern(matrix, w, h, x, y, pattern, direction):
            n += 1
    print('Success:', n)
    write_file(OUT_FILE, matrix)
