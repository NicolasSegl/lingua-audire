# -*- coding: utf-8 -*- 

import codecs
import string
import sys
# python tsvToSQL.py ../languages/urdu/validated.tsv ../languages/urdu/validated.sql ../languages/urdu/frequency.txt urdu
from constants import TSV_PATH_INDEX, TSV_SENTENCE_INDEX, FREQUENCY_INDEX, WORD_INDEX

# constants for calculating word difficulty
VOWELS = "aeiouyæøåäöüоыиэяюёе"
HARD_WORD_VALUE = 2
EASY_WORD_VALUE = 1

# constants for the SQL database
TABLE_NAME = "clip"

if (len(sys.argv) != 5):
    print("Usage: python tsvToSQL.py <TSV file name> <SQL file name> <Word frequency file> <language>")
    exit()

tsvFileName           = sys.argv[1]
sqlFileName           = sys.argv[2]
wordFrequencyFileName = sys.argv[3]
language              = sys.argv[4]

# calculates the approximate difficulty of a sentence
def calcDifficulty(clipSentence):
    # contains the value for the difficulty of the sentence
    difficulty = 0

    # contains the entry's sentence with no punctuation and no capitilization
    sentence = clipSentence.translate(str.maketrans('', '', string.punctuation)).lower()

    # contains all of the individual words in the sentence in an array
    words = sentence.split(' ')

    # iterate over all of the words in the sentence
    for word in words:
        # iterate over every single word in the frequency file until the word is found, then move on to the next word in the sentence
        with open(wordFrequencyFileName, "r", encoding="utf-8") as wordFile:
            wordLine = wordFile.readline()
            foundWord = False

            while wordLine:

                wordColumns = wordLine.rstrip().split('\t')
                if wordColumns[WORD_INDEX].lower() == word:
                    difficulty += int(int(wordColumns[FREQUENCY_INDEX]) / 1000 + 1)
                    wordFile.close()
                    foundWord = True
                    break

                wordLine = wordFile.readline()

            # if the word was not found in the frequency list, increase the difficulty dramatically
            if not foundWord:
                difficulty += 200

            wordFile.close()

    return difficulty

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

        sqlFile.write(f"INSERT INTO {TABLE_NAME}(path, sentence, difficulty, language)\n")
        sqlFile.write(f"VALUES(\"{columns[TSV_PATH_INDEX]}\", \"{columns[TSV_SENTENCE_INDEX]}\", {calcDifficulty(columns[TSV_SENTENCE_INDEX])}, \"{language}\");\n\n")

        line = tsvFile.readline().replace('\"', "")

    sqlFile.close()