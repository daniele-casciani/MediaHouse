// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import userManager from "./auth/oidcClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Callback from "./components/Callback";

function App() {
	function login() {
		userManager.signinRedirect()
	}

	function signout() {
		userManager.signoutRedirect();
	}

	const [authenticated, setAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		userManager.getUser().then((user) => {
			if (user) {
				setAuthenticated(true);
			} else {
				setAuthenticated(false);
			}
		});
	});

	return (
		<div className="App">
			<header className="App-header">
				<p>Welcome to MediaHouse React</p>

				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<Login authenticated={authenticated} handleLogin={login} />
							}
						/>
						<Route
							path="/callback"
							element={
								<Callback
									authenticated={authenticated}
									setAuth={setAuthenticated}
									handleLogout={signout}
									userManager={userManager}
								/>
							}
						/>
					</Routes>
				</BrowserRouter>
			</header>
		</div>
	);
}

export default App;