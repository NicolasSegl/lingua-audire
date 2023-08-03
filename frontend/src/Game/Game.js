import axios from 'axios'
import React, { useState, useEffect } from 'react'

// css
import './Game.css'

// mui components
import Button from "@mui/material/Button"
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

// custom components
import AudioPlayer from './AudioPlayer'
import Gameover from './Gameover'
import Stats, { STARTING_LIVES } from './Stats'

// utility functions
import { calcLevDistance, getCookieValue } from './util'

// for themes
import { darkTheme, lightTheme } from '../common/themes'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// for storing data about the audio clip that the user is currently listening to
let currentSentence            = "";
let currentSentencePunctuation = "";
let currentClipPath            = "";

// for storing data about the audio clip that the user will listen to after the currently playing clip
let nextSentence            = "";
let nextSentencePunctuation = "";
let nextClipPath            = "";
let nextAudioClipData       = "";

let correctAudio   = new Audio("../../correct.mp3");
let incorrectAudio = new Audio("../../incorrect.mp3");

const ACCENTS = {
    "portuguese": "àáãâéêíóôõúüç",
    "polish": "ąćęłńóśźż",
    "german": "äöüß",
    "danish": "æøå",
    "swedish": "åäö",
    "french": "âàçêéèëîïôùûü",
    "spanish": "áéíñóúü",
    "turkish": "çğıöşü"
}

function getNextClip(language, difficulty) {
    axios.get('https://lingua-audire-owxddexg4q-ue.a.run.app/getClip', { params: { language: language, difficulty: difficulty} }).then(response => {
        // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
        nextAudioClipData = "data:audio/mp3;base64," + response.data.audioData;
        
        nextClipPath = response.data.path;
        nextSentencePunctuation = response.data.sentence;

        // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
        nextSentence = nextSentencePunctuation.toLowerCase().trim().replace(/[؍۔※。”“、؛،．؟|–《…》〈〉⸺。，、「」『』〜！？（）【】｛｝・.,\/#!$%\^&\*;:{}=\-—_`~()]/g, "");
    }).catch(error => {
        console.log(error)
    });
}

// the root component of the Game page
export default function Game({ theme }) {
    const [submitted, setSubmitted]           = useState(false);
    const [submitColour, setSubmitColour]     = useState("primary");
    const [score, setScore]                   = useState(0);
    const [highScore, setHighScore]           = useState(0);
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    const [lives, setLives]                   = useState(STARTING_LIVES);
    const [audioClip, setAudioClip]           = useState(new Audio());
    const [hintButtonUsed, setHintButtonUsed] = useState(false);
    const [isClipReported, setClipReported]   = useState(false);

    // used for sending GET requests to the server[]
    // the second parameter in the array generated below will be the language, and the third will be the difficulty
    const SELECTED_LANGUAGE = window.location.pathname.split("/")[2].toLowerCase();
    const SELECTED_DIFFICULTY = window.location.pathname.split("/")[3];

    // to be called upon the game being over (should the user decide to restart the game)
    // it simply resets some of the above values to their origianl states
    function resetGame() {
        setHintButtonUsed(false);
        setSubmitted(false);
        setSubmitColour("primary");
        setScore(0);
        setLives(STARTING_LIVES);
        getClip();
        setIsNewHighScore(false);
    }

    // performs a GET call to the server for a clip
    function getClip() {
        // if there is an audio clip currently playing, have it pause 
        audioClip.pause();

        // if we have already loaded the next audio clip into a buffer, then we can
        // immediately load the next clip (without first having to wait to fetch from the server)
        if (nextAudioClipData) {
            setAudioClip(new Audio(nextAudioClipData));
            currentClipPath = nextClipPath;
            currentSentence = nextSentence;
            currentSentencePunctuation = nextSentencePunctuation;
            getNextClip(SELECTED_LANGUAGE, SELECTED_DIFFICULTY);
        } else {

            // this will prevent the previous audio clip's data from preserving until a new audio clip has been fetched
            setAudioClip(new Audio());

            // fetch a clip from the server to use immediately
            axios.get('https://lingua-audire-owxddexg4q-ue.a.run.app/getClip', { params: { language: SELECTED_LANGUAGE, difficulty: SELECTED_DIFFICULTY} }).then(response => {
                // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
                setAudioClip(new Audio("data:audio/mp3;base64," + response.data.audioData));
                
                currentClipPath = response.data.path;
                currentSentencePunctuation = response.data.sentence;

                // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
                currentSentence = currentSentencePunctuation.toLowerCase().trim().replace(/[؍۔※。”“、؛،．؟|–《…》〈〉⸺。，、「」『』〜！？（）【】｛｝・.,\/#!$%\^&\*;:{}=\-—_`~()]/g, "");
            }).catch(error => {
                console.log(error)
            });

            // after the current clip has been fetched, fetch the next clip as well (so it's ready immediately)
            getNextClip(SELECTED_LANGUAGE, SELECTED_DIFFICULTY);
        }
    }

    // immediately get a clip from the server upon the game interface loading
    // as well, fetch the high score for the language (if one so exists)
    // and change the tab's title
    useEffect(() => {
        getClip();

        // fetch the high score from the browser's cookies
        let highScore = getCookieValue("highscore");
        if (highScore != '') {
            setHighScore(Number(highScore));
        }

        // set the tab's title
        document.title = "Lingua Audire - " + SELECTED_LANGUAGE;
    }, []);

    function prepareClip() {
        // fetch a new clip from the server
        getClip();

        // unsubmit the answer (meaning the user can know answer, instead of clicking on the "next" button)
        setSubmitted(false);

        // reset the colour of the check/next button
        setSubmitColour("primary");
        
        // reset the text inside the answer textfield
        document.getElementById("answer-input").value = "";

        // allow the hint button to be used again
        setHintButtonUsed(false);

        // allow the report button to be used again
        setHintButtonUsed(false);
    }
    
    function handleCheckButtonClick() {
        // only allow the check button to be pressed if the audio clip has loaded
        if (!isNaN(audioClip.duration)) {
            if (!submitted) {
                setSubmitted(true);

                let answerInput = document.getElementById("answer-input");
                let userAnswer  = answerInput.value.toLowerCase().trim().replace(/[؍۔※。”“、؛،．؟|–《…》〈〉⸺。，、「」『』〜！？（）【】｛｝・.,\/#!$%\^&\*;:{}=\-—_`~()]/g, "");

                let levenshteinDistance = 15;

                if (SELECTED_LANGUAGE === "japanese") {
                    levenshteinDistance = 5;
                }
                
                // compare how close the user's answer is to the correct sentence. if they have a relatively close
                // levenshtein distance, then we'll say that the user was correct
                if (calcLevDistance(userAnswer, currentSentence) <= currentSentence.length / levenshteinDistance)
                {
                    // play the "correct" sound effect if the user has sound effects enabled
                    if (getCookieValue("soundEffectsEnabled") != "false") {
                        correctAudio.play();
                    }
                    
                    setSubmitColour("success");
                    setScore(score + 1);
                }
                else {
                    // play the "incorrect" sound effect if the user has sound effects enabled
                    if (getCookieValue("soundEffectsEnabled") != "false") {
                        incorrectAudio.play();
                    }
                    setLives(lives - 1);
                    setSubmitColour("error");
                }
            }
            else {
                // this if statement allows for the user the chance to see their mistake on the final wrong answer for the game
                // upon clicking next again, the game will be over
                if (lives == 0) {
                    setLives(lives - 1);
                }
                else {
                    // if there are enough lives remaining for hte player, get the next clip from the server
                    prepareClip();
                }
            }

            let highScore = getCookieValue("highscore");

            if ((highScore === '' && score > 0) || score > Number(highScore)) {
                setHighScore(Number(score));
                document.cookie = "highscore=" + score + "; expires=Tues, 1 Jan 2030 12:00:00 UTC; path=" + window.location.pathname;
                setIsNewHighScore(true);
            }
        }
    }

    function handleHintButtonClick() {
        // only allow the hint button to be used if it has not yet been used this clip
        // and only if the audio clip has been loaded in
        if (!hintButtonUsed && !isNaN(audioClip.duration)) {
            // stores the words that the user has typed into the answer input in an array
            let userWords     = document.getElementById("answer-input").value.toLowerCase().split(" ");
            let sentenceWords = "";
            
            if (SELECTED_LANGUAGE === "japanese") {
                sentenceWords = currentSentence.split("");
            } else {
                sentenceWords = currentSentence.split(" ");
            }

            // iterate over every word in the list of words the user has typed in
            // if we have to fix two words, then we will not give the user an extra word
            let fixedWordCount = 0;
            for (let wordIndex = 0; wordIndex < userWords.length; wordIndex += 1) {
                // remove all spaces from the user's answer (as it will interfer with finding a hint for the words)
                if (userWords[wordIndex] == '') {
                    userWords.splice(wordIndex, 1);
                    wordIndex -= 1;
                    continue;
                }

                // if the words do not match, then fix the user's answer
                if (userWords[wordIndex] != sentenceWords[wordIndex]) {
                    userWords[wordIndex] = sentenceWords[wordIndex];
                    fixedWordCount += 1;
                    if (fixedWordCount >= 2) {
                        break;
                    }
                }
            }

            // change the actual text field's answer to its (potentially) new value
            document.getElementById("answer-input").value = userWords.join(" ");

            // if no words or just one word was fixed, give the user another word (if there is another word they need)
            if (fixedWordCount < 2 && userWords.length < sentenceWords.length) {
                // the tertiary operators below are to ensure that we do not add a space to the text field before the 
                // word we are giving the user IF that word would be the first word in the answer
                if (userWords[0] == '') {
                    document.getElementById("answer-input").value += (userWords.length > 0 ? " " : "") + sentenceWords[userWords.length - 1];
                } else {
                    document.getElementById("answer-input").value += (userWords.length > 0 ? " " : "") + sentenceWords[userWords.length];
                }
            }

            setHintButtonUsed(true);
        }
    }

    function handleReportbuttonClicked() {
        // only allow the report button to be used if it has not yet been used this clip
        if (!isClipReported) {
            // send a post request to the backend to handle the report
            axios.post("https://lingua-audire-owxddexg4q-ue.a.run.app/reportClip", { path: currentClipPath });

            setClipReported(true);
        }
    }

    // this function enables the user to press enter/return to submit their answer (as opposed to having to click the "check" button)
    function handleAnswerKeyDown(event) {
        if (event.key === "Enter") {
            handleCheckButtonClick();
            event.preventDefault();
        }
    }

    function handleAccentButtonClick(character) {
        document.getElementById("answer-input").value += character;
    }

    if (lives >= 0) {
        return (
            <ThemeProvider theme={theme.theme === "light" ? lightTheme : darkTheme}>
                <div id="game-container">
                    <div id="menu-container">
                        <Stats score={score} highScore={highScore} lives={lives}/>

                        <AudioPlayer audioClip={audioClip}/>
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            multiline 
                            fullWidth 
                            id="answer-input" 
                            label="Answer" 
                            variant="outlined" 
                            disabled={submitted && "disabled"}
                            onKeyDown={handleAnswerKeyDown}
                        />

                        {submitted && 
                        <p className="changes-theme"
                         id="correct-sentence">
                        {submitColour === "success" ? "Correct!" : "Incorrect, the sentence was: " + currentSentencePunctuation}
                        </p>
                        }

                        <Stack direction="row" id="accents-stack">
                            {SELECTED_LANGUAGE in ACCENTS && ACCENTS[SELECTED_LANGUAGE].split("").map((character) => (
                                <Button style={{textTransform: "none"}} onClick={() => handleAccentButtonClick(character)}>{character}</Button>
                            )
                            )}
                        </Stack>

                        <Stack direction="row" id="difficulty-hint-stack">
                            {
                            !submitted ?
                                <Button color={hintButtonUsed ? "error" : "primary"} variant="outlined" onClick={handleHintButtonClick} sx={{fontSize: 20}}>hint</Button>
                            :
                                <Button color={isClipReported ? "error" : "primary"} variant="outlined" onClick={handleReportbuttonClicked} sx={{fontSize: 20}}>report clip</Button>
                            }
                            <Button color={submitColour} onClick={handleCheckButtonClick} variant="outlined" sx={{fontSize: 20}}>{submitted ? "Next" : "Check"}</Button>
                        </Stack>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
    else {
        return (
            <>
                <Gameover score={score} isNewHighScore={isNewHighScore} parentResetFunction={resetGame}/>
            </>
        );
    }
};