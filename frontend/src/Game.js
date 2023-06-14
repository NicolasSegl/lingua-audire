import axios from 'axios'
import React, { useState, useEffect } from 'react'

// css
import './Game.css'

// mui components
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

// mui icons
import PlayArrow from '@mui/icons-material/PlayArrow'
import VolumeDown from '@mui/icons-material/VolumeUp'
import VolumeUp from '@mui/icons-material/VolumeDown'

// custom components
import DifficultyMenu from './components/DifficultyMenu'
import SkipButton from './components/SkipButton'

let currentAudioClip = new Audio();
let currentSentence  = "";

// the root component of the Game page
export default function Game() {
    const [volume, setVolume] = useState(50);
    const [nextButtonVisible, setNextButtonVisible] = useState(false);
    const [currentDifficulty, setCurrentDifficulty] = useState(2);

    // performs a GET call to the server for a clip
    function getClip() {
        axios.get('http://localhost:5000/danish', { params: { difficulty: currentDifficulty} }).then(response => {
            // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
            currentAudioClip = new Audio("data:audio/mp3;base64," + response.data.audioData);

            // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
            currentSentence = response.data.sentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

            currentAudioClip.volume = 0.01;

        }).catch(error => {
        console.log(error)
        });
    }

    // immediately get a clip from the server upon the game interface loading
    useEffect(() => getClip(), []);

    function handleVolumeChange(event, newVolume) {
        setVolume(newVolume);
        currentAudioClip.volume = newVolume / 100;
    }

    function handlePlayButtonClick() {
        currentAudioClip.play();
    }

    function handleTextInput(event)
    {
        let userAnswer = event.target.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/, "");

        if (userAnswer === currentSentence)
        {
            setNextButtonVisible(true);
        }
    }

    function handleNextButtonClick() {
        getClip(currentDifficulty);
        setNextButtonVisible(false);

        // reset the text in the text field
    }

    return (
        <div id="game-container">
            <div id="menu-container">
                <Stack spacing={1.5} direction="row" id="audio-player">
                    <IconButton onClick={handlePlayButtonClick}>
                        <PlayArrow />
                    </IconButton>

                    <VolumeUp />
                    <Slider value={volume} onChange={handleVolumeChange}/>
                    <VolumeDown />
                </Stack>
                <TextField /*disabled={outlineColour === "success" && "disabled"}*/ 
                    multiline 
                    fullWidth 
                    id="answer-input" 
                    label="Answer" 
                    variant="outlined" 
                    onChange={handleTextInput}
                    disabled={nextButtonVisible && "disabled"}
                />

                <Stack direction="row" id="difficulty-skip-stack">
                    <DifficultyMenu parentHandleClose={(event) => setCurrentDifficulty(Number(event.target.innerText))} currentDifficulty={currentDifficulty}/>
                    {!nextButtonVisible && <SkipButton parentHandleClick={() => getClip(currentDifficulty)}/>}
                </Stack>

                {
                nextButtonVisible &&
                <Button onClick={handleNextButtonClick} id="next-button" variant="contained" color="success">Next</Button>
                }
            </div>
        </div>
    );
};