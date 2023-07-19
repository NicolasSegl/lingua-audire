# deletes all clips in the .tsv files in the language folder that are NOT validated.tsv

import os
import sys

from constants import TSV_PATH_INDEX

if len(sys.argv) != 2:
    print("Usage: python removeClips.py <Language Directory>")
    exit()

languageDir = sys.argv[1]
os.chdir(languageDir)
for fileName in os.listdir("."):
    if fileName.endswith(".tsv") and fileName != "validated.tsv":
        with open(fileName, "r", encoding="utf-8") as file:
            line = file.readline().replace('\"', "")
            while line:
                columns = line.rstrip().split('\t')
                try:
                    os.remove("clips/" + columns[TSV_PATH_INDEX])
                except:
                    pass
                line = file.readline().replace('\"', "")