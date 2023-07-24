import React from 'react'

// mui components
import Stack from '@mui/material/Stack'

// mui icons
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined'

// css
import './Stats.css'

export const STARTING_LIVES = 3;

export default function Stats({ score, highScore, lives }) {
    return (
        <Stack direction="row" id="stats">
            <h3>High Score: {highScore === '' ? "0" : highScore.toString()}</h3>
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
    );
}