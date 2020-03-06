import React, { useState } from "react"
import './App.css';
import Main from './components/MainComponent';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthContext } from "./context/auth";

function App(props) {

    const [authTokens, setAuthTokens] = useState();

    const getToken = () => {
        return localStorage.getItem("token");
    }

    const setTokens = (data) => {
        localStorage.setItem("token", data);
        setAuthTokens(data);
    }

    return (
        <AuthContext.Provider value={{ authTokens: getToken, setAuthTokens: setTokens }}>
            <Router>
                <div className="App">
                    <Main token={getToken()}/>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
