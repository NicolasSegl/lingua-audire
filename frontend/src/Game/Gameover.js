import React, { useEffect } from 'react'

// mui components
import Button from "@mui/material/Button"
import Stack from '@mui/material/Stack'

// css
import './Gameover.css'

export default function Gameover({ score, isNewHighScore, parentResetFunction }) {
    return (
        <div id="game-over-menu">
            <h1 className="changes-theme" id="game-over-text">Game Over</h1>
            <p className="changes-theme" id="final-score-text">Final Score: {score}</p>
            {isNewHighScore && <p className="changes-theme">New High Score!</p>}
            <Stack direction="row" spacing={5}>
                <Button variant="contained" onClick={parentResetFunction}>Restart</Button>
                <Button variant="contained" onClick={() => window.location.href='../../'}>Home</Button>
            </Stack>
        </div>
    );
}