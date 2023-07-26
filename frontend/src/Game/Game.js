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
import NavBar from '../common/NavBar'
import Stats, { STARTING_LIVES } from './Stats'

import { calcLevDistance, getCookieValue } from './util'

let currentSentence  = "";
let currentSentencePunctuation = "";
let currentClipPath = "";

// the root component of the Game page
export default function Game() {
    const [submitted, setSubmitted]           = useState(false);
    const [submitColour, setSubmitColour]     = useState("primary");
    const [score, setScore]                   = useState(0);
    const [highScore, setHighScore]           = useState(0);
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    const [lives, setLives]                   = useState(STARTING_LIVES);
    const [audioClip, setAudioClip]           = useState(new Audio());
    const [hintButtonUsed, setHintButtonUsed] = useState(false);
    const [isClipReported, setClipReported]   = useState(false);

    // used for sending GET requests to the server
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

        // this will prevent the previous audio clip's data from preserving until a new audio clip has been fetched
        setAudioClip(new Audio());

        axios.get('https://lingua-audire-owxddexg4q-ue.a.run.app/getClip', { params: { language: SELECTED_LANGUAGE, difficulty: SELECTED_DIFFICULTY} }).then(response => {
            // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
            setAudioClip(new Audio("data:audio/mp3;base64," + response.data.audioData));
            
            currentClipPath = response.data.path;
            currentSentencePunctuation = response.data.sentence;

            // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
            currentSentence = currentSentencePunctuation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        }).catch(error => {
        console.log(error)
        });
    }

    // immediately get a clip from the server upon the game interface loading
    // as well, fetch the high score for the language (if one so exists)
    useEffect(() => {
        getClip();

        // fetch the high score from the browser's cookies
        let highScore = getCookieValue("highscore");
        if (highScore != '') {
            setHighScore(Number(highScore));
        }
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
                let userAnswer  = answerInput.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                
                // compare how close the user's answer is to the correct sentence. if they have a relatively close
                // levenshtein distance, then we'll say that the user was correct
                if (calcLevDistance(userAnswer, currentSentence) <= currentSentence.length / 15)
                {
                    setSubmitColour("success");
                    setScore(score + 1);
                }
                else {
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

            if (highScore === '' || score > Number(highScore)) {
                setHighScore(Number(score));
                document.cookie = "highscore=" + score + "; expires=Tues, 1 Jan 2030 12:00:00 UTC; path=" + window.location.pathname;
                setIsNewHighScore(true);
            }
        }
    }

    function handleHintButtonClick() {
        // only allow the hint button to be used if it has not yet been used this clip
        if (!hintButtonUsed) {
            // stores the words that the user has typed into the answer input in an array
            let userWords     = document.getElementById("answer-input").value.toLowerCase().split(" ");
            let sentenceWords = currentSentence.split(" ");

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
                if (userWords[0] == '') {
                    document.getElementById("answer-input").value += " " + sentenceWords[userWords.length - 1];
                } else {
                    document.getElementById("answer-input").value += " " + sentenceWords[userWords.length];
                }
            }

            setHintButtonUsed(true);
        }
    }

    function handleReportbuttonClicked() {
        // only allow the report button to be used if it has not yet been used this clip
        if (!isClipReported) {
            console.log(currentClipPath);
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

    if (lives >= 0) {
        return (
            <>
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
                        <p id="correct-sentence">{submitColour === "success" ? "Correct!" : "Incorrect, the sentence was: " + currentSentencePunctuation}</p>
                        }

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
            </>
        );
    }
    else {
        return (
            <>
                <NavBar />
                <Gameover score={score} isNewHighScore={isNewHighScore} parentResetFunction={resetGame}/>
            </>
        );
    }
};