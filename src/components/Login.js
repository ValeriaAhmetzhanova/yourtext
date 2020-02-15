import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import {Button, Card, Form} from "react-bootstrap";

function Login() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthTokens } = useAuth();

    function onLogin() {
        console.log('__onLogin__');
        console.log('username: ' + userName);
        console.log('password: ' + password);

        if (!userName|| !password) {
            console.log("seems like not complete");
        } else {
            postLogin(userName, password);
        }
    }

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    function postLogin(usn, pswd){
        var url = 'http://169.60.115.39:8888/login';
        var params = {
            "username": usn,
            "password": pswd
        };

        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(params), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    setAuthTokens(response.data); // TODO look in cookies
                    setLoggedIn(true);
                }
                else {
                    alert(response.text);
                    setIsError(true);
                }})
            .catch(error => console.log(error));
    }

    return (
        <Card>
            <Form>
                <input
                    type="username"
                    value={userName}
                    onChange={e => {
                        setUserName(e.target.value);
                    }}
                    placeholder="username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                    placeholder="password"
                />
                <Button onClick={onLogin}>Sign In</Button>
            </Form>
            <Link to="/signup">Don't have an account?</Link>
            { isError &&<div>The username or password provided were incorrect!</div> }
        </Card>
    );
}

export default Login;