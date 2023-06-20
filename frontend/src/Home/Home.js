import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

// mui components
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'

// css
import './Home.css'

// an array with all the supported languages
const SUPPORTED_LANGUAGES = [
    "Dansk",
    "Deutsch",
];

let redirectLanguage = "";

function LanguageSelect() {
    const [selectedLanguage, setSelectedLanguage] = useState('');

    function handleChange(event) {
        setSelectedLanguage(event.target.value);
        redirectLanguage = event.target.value;
        console.log(redirectLanguage);
    }

    return (
        <>
            <FormControl sx={{width: 1/5}}>
                <InputLabel>Language</InputLabel>
                <Select
                    value={selectedLanguage}
                    label="Language"
                    onChange={handleChange}
                >
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem> 
                    )
                    )}
                </Select>
            </FormControl>
        </>
    );
}

export default function Home() {
	return (
		<>
			<h1 id="header">Lingua Audire</h1>
            <div id="subheader-container">
			    <h3 id="subheader">Designed to improve language listening skills, Lingua Audire provides a way for users to audibly input in their target language.</h3>
            </div>

            <Stack id="start-game-stack" direction="row" spacing={5}>
                <LanguageSelect />
                <Button variant="contained" onClick={() => window.location.href='/game/' + redirectLanguage}>Start Game</Button>
            </Stack>
		</>
	);
};