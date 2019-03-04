#!/usr/bin/env python3
"""aggregator.py

This code is for enumeration of general categories.
"""

from operator import itemgetter
import sys

current_code = None
current_count = 0
count = None
cat_numbers={"1xx":0 , "2xx":0 , "3xx":0 , "4xx":0 , "5xx":0}

# input comes from STDIN
for line in sys.stdin:
    # remove leading and trailing whitespace
    line = line.strip()

    # parse the input we got from mapper.py
   
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
    if current_count:
        if current_code[0] == code[0] :
            current_count += count
            current_code = code
        else:
            # write result to STDOUT
            cat_numbers[current_code[0]+"xx"] = current_count
            current_count = count
            current_code = code
           
        
    else:
         current_count = count
         current_code = code
        

# do not forget to output the last code if needed!
if current_code[0] == code[0]:
    cat_numbers[current_code[0]+"xx"] += current_count
    
total = sum(cat_numbers.values())
for cat in cat_numbers:
    print(cat ,":", cat_numbers[cat] , "   "+str(round(100 * cat_numbers[cat] / total))+"%")
print("Total = " +str(total))