import random
import json

def read_file(filename):
    with open(filename, 'r') as f:
        for line in f:
            yield line

def write_file(filename, data):
    with open(filename, 'w') as f:
        f.write(data)

tree_index = 0
empty_index = 0
key_index = 0
stone_index = 0
dragon_index = 0
girl_index = 0

def create_maze(sym_maze, option):
    global tree_index
    global empty_index
    global key_index
    global stone_index
    global girl_index
    global dragon_index

    teleport_index = 0

    maze = []
    for line in sym_maze:
        maze_line = []
        for symb in line:
            if symb == '#':
                maze_line.append({"id" : tree_index, "type" : "tree"})
                tree_index += 1
            if symb == 's':
                maze_line.append({"id" : stone_index, "type" : "stone"})
                stone_index += 1
            elif symb == 'z':
                maze_line.append({"id" : empty_index, "type" : "empty"})
                empty_index += 1
            elif symb == '.':
                if (random.randint(0,100) % 30 == 0 and option == 1) or (random.randint(0,100) % 10 == 0 and option == 2):
                    maze_line.append({"id" : stone_index, "type" : "stone"})
                    stone_index += 1
                elif random.randint(0,100) % 30 == 0 and option == 1:
                    maze_line.append({"id" : tree_index, "type" : "tree"})
                    tree_index += 1
                else:
                    maze_line.append({"id" : empty_index, "type" : "empty"})
                    empty_index += 1
            elif symb == '_':
                maze_line.append({"id" : teleport_index, "type" : "teleport"})
                teleport_index += 1
            elif symb == 'o':
                maze_line.append({"id" : key_index, "type" : "key"})
                key_index += 1
            elif symb == 'g':
                maze_line.append({"id" : girl_index, "type" : "girl"})
                girl_index += 1
            elif symb == 'd':
                # task indexes are from 1
                dragon_index += 1
                maze_line.append({"id" : dragon_index, "type" : "dragon"})
                
        maze.append(maze_line)
    return maze


if __name__ == "__main__":
    sym_maze = read_file("sym_maze.txt")
    maze = create_maze(sym_maze, 1)
    catacomb_maze = read_file("catacomb_maze.txt")
    catacomb_maze = create_maze(catacomb_maze, 2)
    write_file("maze.txt", json.dumps({'sunnyMaze' : maze, "catacombMaze" : catacomb_maze, "playerPosition" : {"x" : 35, "z" : 60}}))
    print(dragon_index)