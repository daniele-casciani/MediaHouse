// src/App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import { createZitadelAuth, ZitadelConfig, } from "@zitadel/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Callback from "./components/Callback";

function App() {
  const config: ZitadelConfig = {
    authority: process.env.REACT_APP_AUTH_ISSUER!, 
    client_id: process.env.REACT_APP_AUTH_CLIENT_ID!,  
    redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI!,
    post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI!,
    scope: "openid profile email",
    response_type: "code",
  };

  const zitadel = createZitadelAuth(config);
  console.log("Zitadel Auth Config:", config);

  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

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
                  userManager={zitadel.userManager}
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