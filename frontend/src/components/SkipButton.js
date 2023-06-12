import React from 'react'

// mui
import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// define the custom theme for the skip button
const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#f44336',
            darker: '#053e85',
      }
}});

export default function SkipButton({ parentHandleClick }) {
    return (
        <ThemeProvider theme={theme}>
            <Button onClick={parentHandleClick} variant="contained">
                Skip
            </Button>
        </ThemeProvider>
    );
}