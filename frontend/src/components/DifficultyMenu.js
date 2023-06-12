import React, { useState } from 'react'

// mui
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// mui icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function DifficultyMenu({ parentHandleClose, currentDifficulty }) {

    const selectedItemSX = {
        backgroundColor: "#3f51b5",
        color: "white",
        "&:hover": {
            color: "white",
            backgroundColor: "#3f51b5"
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        parentHandleClose(event);
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Difficulty
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem sx={currentDifficulty === 1 ? selectedItemSX : {}} onClick={handleClose}>1</MenuItem>
                <MenuItem sx={currentDifficulty === 2 ? selectedItemSX : {}} onClick={handleClose}>2</MenuItem>
                <MenuItem sx={currentDifficulty === 3 ? selectedItemSX : {}} onClick={handleClose}>3</MenuItem>
            </Menu>
        </div>
  );
}