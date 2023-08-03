import React, { useState } from 'react'

// mui components
import Button from "@mui/material/Button"
import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'

// mui icons
import VolumeUp from '@mui/icons-material/VolumeUp'
import VolumeOff from '@mui/icons-material/VolumeOff'

// for themes
import { buttonDarkTheme, buttonLightTheme } from './themes'
import { ThemeProvider } from '@mui/material/styles'

import { getCookieValue } from '../Game/util'

export default function NavBar({ changedThemeFunction, theme }) {
	const [soundEnabled, setSoundEnabled] = useState(true);

	function onSoundEffectsToggleClick() {
		setSoundEnabled(!soundEnabled);
		document.cookie = "soundEffectsEnabled=" + soundEnabled + "; expires=Tues, 1 Jan 2030 12:00:00 UTC; path=/";
	}

	return (
		<div id="NavBar">
			<div id="left-align-navbar">
				<a className="changes-theme" href="/">Lingua Audire</a>
				<a className="changes-theme" href="/About/">About</a>
			</div>
			<div id="right-align-navbar">
				<Tooltip title="Toggle Sound Effects" placement="bottom">
					<IconButton onClick={onSoundEffectsToggleClick}>
						{getCookieValue("soundEffectsEnabled") != "false" ? <VolumeUp className="changes-theme" /> : <VolumeOff className="changes-theme" />}
					</IconButton>
				</Tooltip>
				<ThemeProvider theme={theme === "light" ? buttonLightTheme : buttonDarkTheme}>
					<Button onClick={changedThemeFunction} style={{textTransform: "none"}}>{theme === "light" ? "Light" : "Dark"} Mode</Button>
				</ThemeProvider>
			</div>
		</div>
	);
}