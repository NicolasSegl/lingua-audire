import axios from 'axios'
import React, { useState, useEffect, startTransition } from 'react'

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
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrow from '@mui/icons-material/PlayArrow'
import SpeedIcon from '@mui/icons-material/Speed';
import VolumeUp from '@mui/icons-material/VolumeDown'

// used for sending GET requests to the server
// the first 6 charactrs of the path name will be '/game/'
const SELECTED_LANGUAGE = window.location.pathname.substring(6).toLowerCase();

const STARTING_LIVES = 3;
const STARTING_VOLUME = 50;
const STARTING_PLAYBACK_SPEED = 1;

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
    const [volume, setVolume] = useState(STARTING_VOLUME);
    const [playbackSpeed, setPlaybackSpeed] = useState(STARTING_PLAYBACK_SPEED);
    const [currentDifficulty, setCurrentDifficulty] = useState(2);
    const [submitted, setSubmitted] = useState(false);
    const [submitColour, setSubmitColour] = useState("primary");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(STARTING_LIVES);

    function resetGame() {
        setVolume(STARTING_VOLUME);
        setPlaybackSpeed(STARTING_PLAYBACK_SPEED);
        setCurrentDifficulty(2);
        setSubmitted(false);
        setSubmitColour("primary");
        setScore(0);
        setLives(STARTING_LIVES);
    }

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
            <div id="game-container">
                <div id="menu-container">

                    <Stack direction="row" id="stats">
                        <h3>Score: {score.toString()}</h3>
                        <div id="hearts">
                        {Array(lives).fill(0).map(() => {
                            return <Favorite style={{color: "red"}}/>
                            })
                        }
                        {Array(STARTING_LIVES - lives).fill(0).map(() => {
                            return <FavoriteBorderIcon style={{color: "red"}} />
                        })
                        }
                        </div>
                    </Stack>

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
    }
    else {
        return (
            // this, for instance, could easily be a custom component (only thing to pass in would be score? and resetGame?)
            <div id="game-over-menu">
                <h1 id="game-over-text">Game Over</h1>
                <p id="final-score-text">Final Score: {score}</p>
                <Stack direction="row" spacing={5}>
                    <Button variant="contained" onClick={resetGame}>Restart</Button>
                    <Button variant="contained" onClick={() => window.location.href='../../'}>Home</Button>
                </Stack>
            </div>
        );
    }
};