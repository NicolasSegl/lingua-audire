import React, { useState } from 'react'
import axios from 'axios'
import './Game.css'

// mui components
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'

// mui icons
import VolumeUp from '@mui/icons-material/VolumeDown'
import VolumeDown from '@mui/icons-material/VolumeUp'
import PlayArrow from '@mui/icons-material/PlayArrow'

let currentAudioClip = new Audio();

// performs a GET call to the server for a clip
// the returned value is a b64 encoding of the clip's audio file
function b64GetClip() {
    // in the future we will pass parameters to the GET request such as: /clips?lang='danish'&difficulty='5'
    axios.get('http://localhost:5000/danish').then(response => {
        currentAudioClip = new Audio("data:audio/mp3;base64," + response.data.audioData);
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

    function handleVolumeChange(event, newVolume) {
        setVolume(newVolume);
    }

    function handlePlayButtonClick() {
         currentAudioClip.play();
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
                <TextField fullWidth id="answer-input" label="Answer" variant="outlined"/>
            </div>
        </div>
    );
};

export default Game;