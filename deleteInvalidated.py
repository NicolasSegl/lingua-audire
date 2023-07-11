# deletes clips that are invalidated, as we will never use them for the site

import os
import sys

from backend.constants import TSV_PATH_INDEX

if (len(sys.argv) != 3):
    print("Usage: python deleteInvalidated.py <TSV file name> <Clips folder>")
    exit()

tsvFileName     = sys.argv[1]
clipsFolderName = sys.argv[2]

# open the .tsv file provided by the user
with open(tsvFileName, "r", encoding="utf-8") as tsvFile:
    
    # first line always details the columns, so we do not need it 
    line = tsvFile.readline()
    line = tsvFile.readline().replace('\"', "")

    while line: 
        # get all of the columns of the .tsv file into a list
        columns = line.rstrip().split('\t')
        
        os.remove(clipsFolderName + columns[TSV_PATH_INDEX])
        line = tsvFile.readline().replace('\"', "")