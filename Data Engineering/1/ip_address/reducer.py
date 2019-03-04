#!/usr/bin/env python3
"""reducer.py

This code is for enumeration of ip addresses and aws canoical user ID's.
Ali Taheri
"""

from operator import itemgetter
import sys

current_code = None
current_count = 0
count = None

# input comes from STDIN
for line in sys.stdin:
    # remove leading and trailing whitespace
    line = line.strip()

    # parse the input we got from mapper.py
    #word, count = line.split('\t', 1)
    code, count = line.split()

    # convert count (currently a string) to int
    try:
        count = int(count)
    except ValueError:
        # count was not a number, so silently
        # ignore/discard this line
        continue

    # this IF-switch only works because Hadoop sorts map output
    # by key (here: word) before it is passed to the reducer
    if current_code == code:
        current_count += count
    else:
        if current_code:
            # write result to STDOUT
            print (current_code, current_count)
        current_count = count
        current_code = code

# do not forget to output the last word if needed!
if current_code == code:
    print (current_code, current_count)
