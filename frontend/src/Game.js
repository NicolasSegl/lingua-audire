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
import Tooltip from '@mui/material/Tooltip'

// mui icons
import PlayArrow from '@mui/icons-material/PlayArrow'
import SpeedIcon from '@mui/icons-material/Speed';
import VolumeUp from '@mui/icons-material/VolumeDown'

// used for sending GET requests to the server
// the first 6 charactrs of the path name will be '/game/'
const SELECTED_LANGUAGE = window.location.pathname.substring(6).toLowerCase();

// computes the edit distance between the two given strings (a, b)
// taken from https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript,
// as my crude recursive implentation was far too slow to be practical
function calcLevDistance(a, b) {
    if (a.length === 0) return b.length; 
    if (b.length === 0) return a.length;
  
    var matrix = [];
  
    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i-1) == a.charAt(j-1)) {
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                  Math.min(matrix[i][j-1] + 1, // insertion
                                           matrix[i-1][j] + 1)); // deletion
        }
      }
    }
  
    return matrix[b.length][a.length];
  };

let currentAudioClip = new Audio();
let currentSentence  = "";
let currentSentencePunctuation = "";

// the root component of the Game page
export default function Game() {
    const [volume, setVolume] = useState(50);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [currentDifficulty, setCurrentDifficulty] = useState(2);
    const [submitted, setSubmitted] = useState(false);
    const [submitColour, setSubmitColour] = useState("primary");

    // performs a GET call to the server for a clip
    function getClip() {
        axios.get('http://localhost:5000/getClip', { params: { language: SELECTED_LANGUAGE, difficulty: currentDifficulty} }).then(response => {
            // instantiate an audio object using the base64 encoded string of the audio file's raw data as retrieved from the server
            currentAudioClip = new Audio("data:audio/mp3;base64," + response.data.audioData);

            // strip the sentence of all punctuation and capitlization, so that we can easily compare the user's answer with the sentence
            currentSentencePunctuation = response.data.sentence;
            currentSentence = currentSentencePunctuation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
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

    function handlePlaybackSpeedChange(event, newPlaybackSpeed) {
        setPlaybackSpeed(newPlaybackSpeed);
        currentAudioClip.playbackRate = newPlaybackSpeed;
    }

    function handlePlayButtonClick() {
        currentAudioClip.play();
    }

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
            answerInput.value = "";

            if (calcLevDistance(userAnswer, currentSentence) <= currentSentence.length / 15)
            {
                setSubmitColour("success");
            }
            else {
                setSubmitColour("error");
            }
        }
        else {
            prepareClip();
        }
    }

    return (
        <div id="game-container">
            <div id="menu-container">
                <Stack spacing={1.5} direction="row" id="audio-player">
                    <Tooltip title="Play Audio" placement="top">
                        <IconButton onClick={handlePlayButtonClick}>
                            <PlayArrow />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Playback Speed" placement="top">
                        <SpeedIcon />
                    </Tooltip>
                    <Slider valueLabelDisplay="auto" min={0.25} max={2.0} step={0.25} value={playbackSpeed} onChange={handlePlaybackSpeedChange}/>

                    <Tooltip title="Volume" placement="top">
                        <VolumeUp />
                    </Tooltip>
                    <Slider valueLabelDisplay="auto" value={volume} onChange={handleVolumeChange}/>
                </Stack>
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
    );
};