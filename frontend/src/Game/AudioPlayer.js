import React, { useState } from 'react'

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
const STARTING_VOLUME = 50;
const STARTING_PLAYBACK_SPEED = 1;

export default function AudioPlayer({ audioClip}) {
    const [volume, setVolume] = useState(STARTING_VOLUME);
    const [playbackSpeed, setPlaybackSpeed] = useState(STARTING_PLAYBACK_SPEED);

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

    return (
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
    );
}