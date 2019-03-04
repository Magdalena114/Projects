#!/usr/bin/env python3
"""mapper.py

This code is for extraction of ip addresses and aws canoical user ID's.
Ali Taheri
"""

import sys

# input comes from STDIN (standard input)
for line in sys.stdin:
    # remove leading and trailing whitespace
    line = line.strip()
    # split the line into words
    strings = line.split()
    # increase counters
    for k in range(len(strings)):
        if strings[k][-6:] == '+0000]' :
            # write the results to STDOUT (standard output);
            # what we output here will be the input for the
            # Reduce step, i.e. the input for reducer.py
            #
            # tab-delimited; the trivial word count is 1
            print(strings[k+1], 1)
        elif ((strings[k][0:4] == "data") or (strings[k][0:4] == "intr") or (strings[k][0:4] == "soft") \
            or (strings[k][0:4] == "visu") or (strings[k][0:4] == "dyna")) and strings[k][-7:] != ".tar.gz" :
            print(strings[k-1], 1)

