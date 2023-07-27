import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// css
import './common/base.css';

// page components
import About from './About/About'
import Game from './Game/Game'
import Home from './Home/Home'
import NavBar from './common/NavBar'
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getCookieValue } from './Game/util';

function Footer() {
	return (
		<div className="changes-theme" id="Footer">
			<p>A feature you would like added to the site? A bug you would like to report? Send an email to: linguaaudire@gmail.com</p>
			<p>Any support for the upkeep and further development of the site is greatly appreciated. If you would like to make a small donation, you can do so at: <a href="https://www.buymeacoffee.com/linguaaudire">https://www.buymeacoffee.com/linguaaudire</a></p>
		</div>
	);
}

function Main(theme) {
	return (
		<Routes>
			<Route exact path='/' element={<Home theme={theme}/>}></Route>
			<Route exact path='/game/*' element={<Game theme={theme}/>}></Route>
			<Route exact path='/about/' element={<About />}></Route>
		</Routes>
	);
}

function App() {
	const [theme, setTheme] = useState("light");

	function changeThemeFunction() {
		if (theme === "dark") {
			document.documentElement.style.setProperty("--theme-colour", "#333333");
			document.documentElement.style.setProperty("--theme-background-colour", "whitesmoke");
			setTheme("light");
			document.cookie = "theme=light; expires=Tues, 1 Jan 2030 12:00:00 UTC; path=/"
		} else {
			document.documentElement.style.setProperty("--theme-colour", "whitesmoke");
			document.documentElement.style.setProperty("--theme-background-colour", "#333333");
			setTheme("dark");
			document.cookie = "theme=dark; expires=Tues, 1 Jan 2030 12:00:00 UTC; path=/"
		}
	}

	// everytime a page loads, this hook will be called
	// it is necessary to set the css variables each time a page is loaded (as they will otherwise
	// assume default values, which may or may not be the theme preference of the user)
	useEffect(() => {
		let userTheme = getCookieValue("theme");

		if (userTheme === '' || userTheme === "light") {
			document.documentElement.style.setProperty("--theme-colour", "#333333");
			document.documentElement.style.setProperty("--theme-background-colour", "whitesmoke");
			setTheme("light");
		} else {
			document.documentElement.style.setProperty("--theme-colour", "whitesmoke");
			document.documentElement.style.setProperty("--theme-background-colour", "#333333");
			setTheme("dark");
		}
	}, []);

	return (
		<div id="App">
			<link rel="icon" type="image/x-icon" href="./favicon.ico" />
			<NavBar theme={theme} changedThemeFunction={changeThemeFunction}/>
			<Main theme={theme}/>
			<Footer></Footer>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
