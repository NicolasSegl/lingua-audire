import React, { useState, useEffect } from 'react'

// mui components
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

// mui icons
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import SpeedIcon from '@mui/icons-material/Speed'
import VolumeUp from '@mui/icons-material/VolumeUp'

// constants
const STARTING_VOLUME = 100;
const STARTING_PLAYBACK_RATE = 1;

let clipRepeat = false;

export default function AudioPlayer({ audioClip }) {
    const [volume, setVolume]               = useState(STARTING_VOLUME);
    const [playbackRate, setPlaybackRate]   = useState(STARTING_PLAYBACK_RATE);
    const [time, setTime]                   = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [intervalID, setIntervalID]       = useState(null);
    const [isPaused, setIsPaused]           = useState(true);
    const [repeat, setRepeat]               = useState(false);

    function handlePlayButtonClick() {
        // only allow the play/pause button to be pressed if the audio clip has been loaded (meaning it has 
        // a duration that is a number)
        if (!isNaN(audioClip.duration)) {
            if (isPaused) {
                audioClip.play();
            }
            else {
                audioClip.pause();
            }
            setIsPaused(!isPaused);
        }
    }

    function handleVolumeChange(event, newVolume) {
        setVolume(newVolume);
        audioClip.volume = newVolume / 100;
    }

    function handleplaybackRateChange(event, newPlaybackRate) {
        setPlaybackRate(newPlaybackRate);
        audioClip.playbackRate = newPlaybackRate;
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
                if (!isNaN(audioClip.duration))
                {
                    setTime(Math.round(audioClip.currentTime * 10) / 10);
                    if (audioClip.currentTime == audioClip.duration) {
                        if (!clipRepeat) {
                            setIsPaused(true); 
                        } else {
                            audioClip.currentTime = 0;
                            audioClip.play();
                            setIsPaused(false);
                        }
                    }
                }
            }, 100));

            // if the audio duration of the clip is a number (meaning the clip has properly loaded)
            // then we will want to set the progress bar's upper limit as well as set the new clip's
            // playback rate and volume to the user's selected values
            if (!isNaN(audioClip.duration)) {
                setAudioDuration(audioClip.duration);
                audioClip.volume = volume / 100;
                audioClip.playbackRate = playbackRate;
                audioClip.play();
                setIsPaused(false);
            };
        });

        // whenever a new clip is received from the server, we must make sure that the play/pause button is a play button
        if (!isPaused && audioClip.paused) {
            setIsPaused(true);
        }
        
        // if the audio clip's duration is NaN then it means there exists no audio clip
        // in this case, we want to say that the duration of the clip is 0 seconds
        if (isNaN(audioClip.duration)) {
            setAudioDuration(0);
            setTime(0);
        }
    }, [audioClip]);

    function handleRepeatButtonClick() {
        clipRepeat = !clipRepeat;
        setRepeat(!repeat);
    }

    return (
        <>
            <Stack spacing={1.5} direction="row" id="progress-bar">
                <Tooltip title={isPaused ? "Play Audio" : "Pause Audio"} placement="top">
                    <IconButton className="changes-theme" onClick={handlePlayButtonClick}>
                        {isPaused ? <PlayArrow /> : <Pause />}
                    </IconButton>
                </Tooltip>
                <p className="changes-theme">00:00</p>
                <Slider max={audioDuration} step={0.01} valueLabelDisplay="auto" value={time} onChange={handleTimeChange}/>
                <p className="changes-theme">{audioDuration / 60 < 10 & "0"}{Math.round(audioDuration / 60)}:{audioDuration % 60 < 10 & "0"}{Math.round(audioDuration % 60)}</p>
                <Tooltip title={"Toggle Clip Looping: " + (repeat ? "On" : "Off")} placement="top">
                    <IconButton className="changes-theme" onClick={handleRepeatButtonClick}>
                        {repeat ? <RepeatOnIcon /> : <RepeatIcon />}
                    </IconButton>
                </Tooltip>
            </Stack>

            <Stack spacing={1.5} direction="row" id="audio-player">
                <Tooltip title="Playback Speed" placement="left">
                    <SpeedIcon className="changes-theme"/>
                </Tooltip>
                <Slider valueLabelDisplay="auto" min={0.25} max={2.0} step={0.25} value={playbackRate} onChange={handleplaybackRateChange}/>

                <Tooltip title="Volume" placement="top">
                    <VolumeUp className="changes-theme"/>
                </Tooltip>
                <Slider valueLabelDisplay="auto" value={volume} onChange={handleVolumeChange}/>
            </Stack>
        </>
    );
}