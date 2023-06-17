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
