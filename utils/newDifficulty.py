# -*- coding: utf-8 -*- 

# determines the difficulty of a sentence using a word frequency list

import codecs
import string
import sys

from constants import TSV_SENTENCE_INDEX, TSV_PATH_INDEX, FREQUENCY_INDEX, WORD_INDEX

if (len(sys.argv) != 3):
    print("Usage: python newDifficulty.py <Language TSV file> <Word frequency file>")
    exit()

tsvFileName           = sys.argv[1]
wordFrequencyFileName = sys.argv[2]

# iterate over every line of the .tsv file to find the sentences, then determine their new difficulties
with open(tsvFileName, "r", encoding="utf-8") as tsvFile:
    # the very first line of the .tsv file will detail all of the columns of our table
    # since we already know what the columns will be, we can skip the first line
    line = tsvFile.readline()
    line = tsvFile.readline().replace('\"', "")

    # create the sql file 
    sqlFile = codecs.open("newDifficulty.sql", "w", "utf-8")

    while line:
        # get all of the columns of the .tsv file into a list
        columns = line.rstrip().split('\t')

        # contains the value for the difficulty of the sentence
        difficulty = 0

        # contains the entry's sentence with no punctuation and no capitilization
        sentence = columns[TSV_SENTENCE_INDEX].translate(str.maketrans('', '', string.punctuation)).lower()

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

        sqlFile.write(f"UPDATE clip\nSET difficulty={difficulty}\nWHERE path=\"{columns[TSV_PATH_INDEX]}\"\n")

        line = tsvFile.readline().replace('\"', "")