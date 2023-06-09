import axios from 'axios'
import React, { useState } from 'react'

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

let currentAudioClip = new Audio();
let currentSentence  = "";

// performs a GET call to the server for a clip
// stores the retrieved data in the currentAudioClip and currentSentence variables
function b64GetClip() {
    // in the future we will pass parameters to the GET request such as: /clips?lang='danish'&difficulty='5'
    axios.get('http://localhost:5000/danish').then(response => {
        currentAudioClip = new Audio("data:audio/mp3;base64," + response.data.audioData);

        // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
        currentSentence = response.data.sentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/, "");
    }).catch(error => {
      console.log(error)
    });
}

// immediately fetch a clip from the server upon the page loading
window.addEventListener("load", () =>
{
    b64GetClip();
});

// the root component of the Game page
function Game() {
    const [volume, setVolume] = useState(50);
    const [nextButtonVisible, setNextButtonVisible] = useState(false);

    function handleVolumeChange(event, newVolume) {
        setVolume(newVolume);
    }

    function handlePlayButtonClick() {
         currentAudioClip.play();
    }

    function handleTextInput(event)
    {
        let userAnswer = event.target.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/, "");

        if (userAnswer == currentSentence)
        {
            // have a next button appear, and disallow the user from further editing the answer
            setNextButtonVisible(true);
        }
    }

    function handleNextButtonClick() {
        b64GetClip();
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
                {
                nextButtonVisible &&
                <Button onClick={handleNextButtonClick} id="next-button" variant="contained" color="success">Next</Button>
                }
            </div>
        </div>
    );
};

export default Game;