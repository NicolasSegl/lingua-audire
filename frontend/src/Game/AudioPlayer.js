import React, { useState, useEffect } from 'react'

// mui components
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

// mui icons
import PlayArrow from '@mui/icons-material/PlayArrow'
import SpeedIcon from '@mui/icons-material/Speed'
import VolumeUp from '@mui/icons-material/VolumeUp'

// constants
const STARTING_VOLUME = 100;
const STARTING_PLAYBACK_SPEED = 1;

export default function AudioPlayer({ audioClip }) {
    const [volume, setVolume] = useState(STARTING_VOLUME);
    const [playbackSpeed, setPlaybackSpeed] = useState(STARTING_PLAYBACK_SPEED);
    const [time, setTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [intervalID, setIntervalID] = useState(null);

    function handlePlayButtonClick() {
        audioClip.play();
    }

    function handleVolumeChange(event, newVolume) {
        setVolume(newVolume);
        audioClip.volume = newVolume / 100;
    }

    function handlePlaybackSpeedChange(event, newPlaybackSpeed) {
        setPlaybackSpeed(newPlaybackSpeed);
        audioClip.playbackRate = newPlaybackSpeed;
    }

    function handleTimeChange(event, newTime) {
        setTime(newTime);
        audioClip.currentTime = newTime;
        audioClip.pause();
    }

    // this effect will have its callback called everytime a new audio clip is fetched from the server
    useEffect(() => {
        // upon loading all the metadata for the audio file (namely how long the audio is), update the audio player
        audioClip.addEventListener("loadedmetadata", () => {
            // update the time progress bar approximately every 100ms
            clearInterval(intervalID);
            setIntervalID(setInterval(() => {
                setTime(Math.round(audioClip.currentTime * 10) / 10);
            }, 100));
            setAudioDuration(audioClip.duration);
        });
    });

    return (
        <>
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
            <Slider max={audioDuration} step={0.01} valueLabelDisplay="auto" value={time} onChange={handleTimeChange}/>
        </>
    );
}