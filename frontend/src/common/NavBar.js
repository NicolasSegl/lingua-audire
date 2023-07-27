import React from 'react'

// mui components
import Button from "@mui/material/Button"

// for themes
import { buttonDarkTheme, buttonLightTheme } from './themes'
import { ThemeProvider } from '@mui/material/styles'

export default function NavBar({ changedThemeFunction, theme }) {
	return (
		<div id="NavBar">
			<div id="left-align-navbar">
				<a className="changes-theme" href="/">Lingua Audire</a>
				<a className="changes-theme" href="/About/">About</a>
			</div>
			<div id="right-align-navbar">
				<ThemeProvider theme={theme === "light" ? buttonLightTheme : buttonDarkTheme}>
					<Button onClick={changedThemeFunction} style={{textTransform: "none"}}>{theme === "light" ? "Light" : "Dark"} Mode</Button>
				</ThemeProvider>
			</div>
		</div>
	);
}