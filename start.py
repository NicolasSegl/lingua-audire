from backend.api import create_app

app = create_app()

# go through each 

# in the js side of things
# have a nextClip variable that stores the next clip (so at the start, fetch two clips from the server?)
# whenever we finish a question, immediately set current clip to nextClip, then GET from the server again to get a value for nextClip

# for added difficulty, allow the option of playing some sort of background audio overtop the audio to make it harder
# i.e., white noise, some music, some crowd bustling, etc

# maybe there is also some way to have them ALMOST get it correct? like oh you are missing a word/one word is incorrect?
# oo a good way to get a good difficulty rating for the words could be to download lists of vocabulary in the language, rated from 
# most commonly used to least commonly used? that would be an excellent way to rate sentences

# might want to consider refactoring Game.js into multiple components instead of having just one big component?

# the colours of the success button (and changing the colour of the answer box) is going to have to be done using a custom css styles object class i believe?

# ensure no repeats as well?