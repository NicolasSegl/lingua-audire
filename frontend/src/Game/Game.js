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

// used for sending GET requests to the server
// the first 6 charactrs of the path name will be '/game/'
const SELECTED_LANGUAGE = window.location.pathname.substring(6).toLowerCase();

let currentSentence  = "";
let currentSentencePunctuation = "";

// the root component of the Game page
export default function Game() {
    const [currentDifficulty, setCurrentDifficulty] = useState(2);
    const [submitted, setSubmitted] = useState(false);
    const [submitColour, setSubmitColour] = useState("primary");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(STARTING_LIVES);
    const [audioClip, setAudioClip] = useState(new Audio());

    function resetGame() {
        setSubmitted(false);
        setSubmitColour("primary");
        setScore(0);
        setLives(STARTING_LIVES);
    }

    // performs a GET call to the server for a clip
    function getClip() {
        axios.get('http://localhost:5000/getClip', { params: { language: SELECTED_LANGUAGE, difficulty: currentDifficulty} }).then(response => {
            // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
            setAudioClip(new Audio("data:audio/mp3;base64," + response.data.audioData));

            // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
            currentSentencePunctuation = response.data.sentence;
            currentSentence = currentSentencePunctuation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        }).catch(error => {
        console.log(error)
        });
    }

    // immediately get a clip from the server upon the game interface loading
    useEffect(() => getClip(), []);

    function prepareClip() {
        getClip(currentDifficulty);
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

            prepareClip();
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