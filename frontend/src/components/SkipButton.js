import React from 'react'

// mui
import Button from '@mui/material/Button'

export default function SkipButton({ parentHandleClick }) {
    return (
        <Button onClick={parentHandleClick} variant="outlined">
            Skip
        </Button>
    );
}