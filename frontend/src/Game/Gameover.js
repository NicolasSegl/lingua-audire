import React from 'react'

// mui components
import Button from "@mui/material/Button"
import Stack from '@mui/material/Stack'

// css
import './Gameover.css'

export default function Gameover({ score, parentResetFunction }) {
    return (
        <div id="game-over-menu">
            <h1 id="game-over-text">Game Over</h1>
            <p id="final-score-text">Final Score: {score}</p>
            <Stack direction="row" spacing={5}>
                <Button variant="contained" onClick={parentResetFunction}>Restart</Button>
                <Button variant="contained" onClick={() => window.location.href='../../'}>Home</Button>
            </Stack>
        </div>
    );
}