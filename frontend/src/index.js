import React from 'react';
import ReactDOM from 'react-dom/client';
import './base.css';
import Game from './Game'
import Home from './Home'
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function NavBar() {
	return (
		<div id="NavBar">
			<a href="/">Lingua Audire</a>
		</div>
	);
}

function Footer() {
	return (
		<div id="Footer">
			<p>A feature you would like added to the site? A bug you would like to report? Send an email to: linguaaudire@gmail.com</p>
			<p>Any support for the upkeep and further development of the site is greatly appreciated. If you would like to make a small donation, you can do so at: <a href="https://www.buymeacoffee.com/linguaaudire">https://www.buymeacoffee.com/linguaaudire</a></p>
		</div>
	);
}

function Main() {
	return (
		<Routes>
			<Route exact path='/' Component={Home}></Route>
			<Route exact path='/game/*' Component={Game}></Route>
		</Routes>
	);
}

function App() {
	return (
		<div id="App">
			<NavBar />
			<Main />
			<Footer></Footer>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
