import React, { useState } from "react"
import './App.css';
import Main from './components/MainComponent';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
import ProfileComponent from "./components/ProfileComponent";
import Login from "./components/Login";

function App(props) {

    const [authTokens, setAuthTokens] = useState();

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data);
    }

  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
          <Router>
              <div className="App">
                  <Main />
              </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;
