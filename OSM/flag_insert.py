#!/usr/bin/python3

import re
import random
import sys

def repl_nodes(matchobj):
    index = int(matchobj.group(1))
    if index >= 3968564715:
        return "<node id=\"%s\"" % str(index + 190)
    else:
        return "<node id=\"%s\"" % index

def repl_nds(matchobj):
    index = int(matchobj.group(1))
    if index >= 3968564715:
        return "<nd ref=\"%s\"" % str(index + 190)
    else:
        return "<nd ref=\"%s\"" % index

def insert_nodes(lines, nodes):
    start = 0
    for index, line in enumerate(lines):
        if re.match(r'.*<node id="3968564714" lat="35\.6573700" lon="139\.7197653" version="1" timestamp="2016-01-26T14:46:07Z" changeset="36818504" uid="621035" user="frejete"/>.*', line):
            start = index + 1
    print(start)
    return lines[:start] + nodes + lines[start:]

def insert_ways(lines, ways):
    start = 0
    for index, line in enumerate(lines):
        if re.match(r'.*<way id="23811703" version="8" timestamp="2015-04-17T18:45:09Z" changeset="30292467" uid="283100" user="tom_konda">.*', line):
            start = index + 9
    print(start)
    return lines[:start] + ways + lines[start:]

def main():

    map_name = sys.argv[1]

    with open(map_name, 'r', encoding='utf-8') as istream,\
    open('flag_nodes', 'r', encoding='utf-8') as nodes_istream,\
    open('flag_ways', 'r', encoding='utf-8') as ways_istream:
        lines = istream.readlines()
        nodes = nodes_istream.readlines()
        ways = ways_istream.readlines()

    with open(map_name[:-4] + '_with_flag' + '.osm', 'w+', encoding='utf-8') as ostream:
        del lines[2]
        new_lines = [re.sub("<node id=\"(\d+)\"", repl_nodes, line) for line in lines]
        new_lines = [re.sub("<nd ref=\"(\d+)\"", repl_nds, line) for line in new_lines]
        new_lines = insert_nodes(new_lines, nodes)
        new_lines = insert_ways(new_lines, ways)
        ostream.writelines(new_lines)

if __name__ == '__main__':
    main()