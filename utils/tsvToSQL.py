# -*- coding: utf-8 -*- 

import sys
import codecs

from constants import TSV_PATH_INDEX, TSV_SENTENCE_INDEX, TSV_ACCENT_INDEX

# constants for calculating word difficulty
VOWELS = "aeiouyæøåäöüоыиэяюёе"
HARD_WORD_VALUE = 2
EASY_WORD_VALUE = 1

# constants for the SQL database
TABLE_NAME = "clip"

# calculates the approximate difficulty of a sentence
def calcDifficulty(sentence):
    # get all of the individual words in the sentence
    words = sentence.split(" ")

    difficulty = 0
    
    for word in words:
        # any words with just 3 or less characters will be considered an easy word
        if len(word) <= 3:
            difficulty += EASY_WORD_VALUE
            continue

        # words with mroe consonants than vowels are considered hard words
        consonants = 0
        vowels = 0
        for char in word:
            if char in VOWELS:
                vowels += 1
            else:
                consonants += 1

        if consonants > vowels:
            difficulty += HARD_WORD_VALUE
        else:
            difficulty += EASY_WORD_VALUE

    return difficulty

if (len(sys.argv) != 4 and len(sys.argv) != 5):
    print("Usage: python tsvToSQL.py <TSV file name> <SQL file name> <language> <OPTIONAL: dialects to ignore>")
    exit()

tsvFileName = sys.argv[1]
sqlFileName = sys.argv[2]
language    = sys.argv[3]

# this would indicate that the optional parameter was passed as well
dialectToOmit = ""
if len(sys.argv) == 5:
    dialectToOmit = sys.argv[4]

with open(tsvFileName, "r", encoding="utf-8") as tsvFile:
    # create (if it doesn't already exist) a SQL file with the name as given by the command line arguments
    # this file will be filled with all of our SQL commands
    sqlFile = codecs.open(sqlFileName, "w", "utf-8")

    # initialize the database if it has not already been initialized
    # the weird formatting is so that the formatting looks proper in the .sql files
    sqlFile.write("""CREATE DATABASE IF NOT EXISTS db;\n
USE db;

CREATE table IF NOT EXISTS `clip` (
    path VARCHAR(200),
    sentence VARCHAR(300),
    difficulty INT,
    language VARCHAR(50)
);

""")
    
    # the very first line of the .tsv file will detail all of the columns of our table
    # since we already know what the columns will be, we can skip the first line
    line = tsvFile.readline()
    line = tsvFile.readline().replace('\"', "")

    while line:
        # get all of the columns of the .tsv file into a list
        columns = line.rstrip().split('\t')

        # if dialectToOmit not in columns[TSV_ACCENT_INDEX].lower():
        sqlFile.write(f"INSERT INTO {TABLE_NAME}(path, sentence, difficulty, language)\n")
        sqlFile.write(f"VALUES(\"{columns[TSV_PATH_INDEX]}\", \"{columns[TSV_SENTENCE_INDEX]}\", {calcDifficulty(columns[TSV_SENTENCE_INDEX])}, \"{language}\");\n\n")

        line = tsvFile.readline().replace('\"', "")

    sqlFile.close()