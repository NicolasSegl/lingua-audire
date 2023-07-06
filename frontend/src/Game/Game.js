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

import { calcLevDistance } from './util'

let currentSentence  = "";
let currentSentencePunctuation = "";

// the root component of the Game page
export default function Game() {
    const [submitted, setSubmitted] = useState(false);
    const [submitColour, setSubmitColour] = useState("primary");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(STARTING_LIVES);
    const [audioClip, setAudioClip] = useState(new Audio());

    // used for sending GET requests to the server
    // the second parameter in the array generated below will be the language, and the third will be the difficulty
    const SELECTED_LANGUAGE = window.location.pathname.split("/")[2].toLowerCase();
    const SELECTED_DIFFICULTY = window.location.pathname.split("/")[3];

    // to be called upon the game being over (should the user decide to restart the game)
    // it simply resets some of the above values to their origianl states
    function resetGame() {
        setSubmitted(false);
        setSubmitColour("primary");
        setScore(0);
        setLives(STARTING_LIVES);
    }

    // performs a GET call to the server for a clip
    function getClip() {
        // if there is an audio clip currently playing, have it pause
        audioClip.pause();

        axios.get('http://localhost:80/getClip', { params: { language: SELECTED_LANGUAGE, difficulty: SELECTED_DIFFICULTY} }).then(response => {
            // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
            setAudioClip(new Audio("data:audio/mp3;base64," + response.data.audioData));
            
            currentSentencePunctuation = response.data.sentence;

            // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
            currentSentence = currentSentencePunctuation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        }).catch(error => {
        console.log(error)
        });
    }

    // immediately get a clip from the server upon the game interface loading
    useEffect(() => getClip(), []);

    function prepareClip() {
        // fetch a new clip from the server
        getClip();

        // unsubmit the answer (meaning the user can know answer, instead of clicking on the "next" button)
        setSubmitted(false);

        // reset the colour of the check/next button
        setSubmitColour("primary");
        
        // reset the text inside the answer textfield
        document.getElementById("answer-input").value = "";
    }

    function handleCheckButtonClick() {
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
    }

    if (lives >= 0) {
        return (
            <>
                <NavBar />
                <div id="game-container">
                    <div id="menu-container">
                        <Stats score={score} lives={lives}/>

                        <AudioPlayer audioClip={audioClip}/>
                        <TextField
                            multiline 
                            fullWidth 
                            id="answer-input" 
                            label="Answer" 
                            variant="outlined" 
                            disabled={submitted && "disabled"}
                        />

                        {submitted && 
                        <p id="correct-sentence">{submitColour === "success" ? "Correct!" : "Incorrect, the sentence was: " + currentSentencePunctuation}</p>
                        }

                        <Stack direction="row" id="difficulty-skip-stack">
                            <Button variant="outlined" onClick={prepareClip} sx={{fontSize: 20}}>Skip</Button>
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
                <Gameover score={score} parentResetFunction={resetGame}/>
            </>
        );
    }
};