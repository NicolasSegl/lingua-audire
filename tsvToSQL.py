import sys

if (len(sys.argv) != 3):
    print("Usage: python tsvToSQL.py <TSV file name> <SQL file name>")
    exit()

TABLE_NAME = "clip"

# the indices of the data in the .tsv file
PATH_INDEX = 1
SENTENCE_INDEX = 2

# get the tsv and sql file names from the command line arguments
tsvFileName = sys.argv[1]
sqlFileName = sys.argv[2]

with open(tsvFileName, "r", encoding="utf-8") as tsvFile:
    # create (if it doesn't already exist) a SQL file with the name as given by the command line arguments
    # this file will be filled with all of our SQL commands
    sqlFile = open(sqlFileName, "w")

    # the very first line of the .tsv file will detail all of the columns of our table
    # since we already know what the columns will be, we can skip the first line
    line = tsvFile.readline()
    line = tsvFile.readline()

    # create the clip table at the start of the SQL file
    sqlFile.write(f"""/* CREATE TABLE */
CREATE TABLE {TABLE_NAME}(
path VARCHAR(100),
sentence VARCHAR(100)
);\n
""")

    while line:
        # get all of the columns of the .tsv file into a list
        columns = line.rstrip().split('\t')

        sqlFile.write(f"INSERT INTO {TABLE_NAME}(path, sentence)\n")
        sqlFile.write(f"VALUES(\"{columns[PATH_INDEX]}\", \"{columns[SENTENCE_INDEX]}\");\n\n")

        line = tsvFile.readline()

    sqlFile.close()