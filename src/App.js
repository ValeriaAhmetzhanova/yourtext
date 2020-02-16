import React, { useState } from "react"
import './App.css';
import Main from './components/MainComponent';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthContext } from "./context/auth";
import { CookiesProvider } from 'react-cookie';

function App(props) {

    const [authTokens, setAuthTokens] = useState();

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data);
    }

  return (
      <CookiesProvider>
          <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
              <Router>
                  <div className="App">
                      <Main token={authTokens} cookies={props.cookies}/>
                  </div>
              </Router>
          </AuthContext.Provider>
      </CookiesProvider>
  );
}

export default App;
