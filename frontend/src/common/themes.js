// for mui themes (dark/light mode)
import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

export const buttonLightTheme = createTheme({
    palette: {
        primary: {
            main: "#333333",
        }
    },
});

export const buttonDarkTheme = createTheme({
    palette: {
        primary: {
            main: "#f5f5f5",
        }
    },
});