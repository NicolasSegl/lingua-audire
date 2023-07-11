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
    "Danish",
    "English",
    "French",
    "German",
    "Italian",
    "Russian",
    "Spanish",
];

const SUPPORTED_DIFFICULTIES = [1, 2, 3];

function SelectMenu({ label, items, setFunction }) {
    const [selectedValue, setSelectedValue] = useState("");

    function handleChange(event) {
        setFunction(event.target.value);
        setSelectedValue(event.target.value);
    }

    return (
        <>
            <FormControl sx={{width: 1/8}}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={selectedValue}
                    label={label}
                    onChange={handleChange}
                >
                    {items.map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem> 
                    )
                    )}
                </Select>
            </FormControl>
        </>
    );
}

export default function Home() {
    const [redirectLanguage, setRedirectLanguage] = useState("");
    const [redirectDifficulty, setRedirectDifficulty] = useState(-1);

    function handleStartGameClick() {
        if (redirectLanguage && redirectDifficulty > 0) {
            window.location.href='/game/' + redirectLanguage + "/" + redirectDifficulty;
        }
    }

	return (
		<>
			<h1 id="header">Lingua Audire</h1>
            <div id="subheader-container">
			    <h3 id="subheader">Designed to improve language listening skills, Lingua Audire provides a way for users to audibly input in their target language.</h3>
            </div>

            <Stack id="start-game-stack" direction="row" spacing={5}>
                <SelectMenu items={SUPPORTED_LANGUAGES} setFunction={setRedirectLanguage} label="Language"/>
                <SelectMenu items={SUPPORTED_DIFFICULTIES} setFunction={setRedirectDifficulty} label="Difficulty"/>
                <Button variant="contained" onClick={handleStartGameClick}>Start Game</Button>
            </Stack>
		</>
	);
};