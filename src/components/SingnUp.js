import React, { useState } from "react";
import { Link } from 'react-router-dom';
import {Button, Card, Form} from "react-bootstrap";

function Signup() {
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function onRegister() {
        console.log('__onRegister__');
        console.log('username: ' + userName);
        console.log('email: ' + email);
        console.log('password: ' + password);

        if (!userName || !email || !password) {
            alert("Fill all fields");
        } else {
            postRegistration(userName, email, password);
        }
    }

    function postRegistration(usn, em, pswd){
        var http = new XMLHttpRequest();
        var url = 'http://169.60.115.39:8888/register';
        var params = {
            "username": usn,
            "email": em,
            "password": pswd
        };
        http.open('POST', url, true);

        http.setRequestHeader('Content-Type', 'application/json');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState === 4 && http.status === 200) {
                if (JSON.parse(http.responseText).success) {
                    alert('You have been successfully signed up!');
                }
                else {
                    alert(JSON.parse(http.responseText).text);
                    setIsError(true);
                }
            }
        };
        http.send(JSON.stringify(params));
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
                    type="email"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                    }}
                    placeholder="email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                    placeholder="password"
                />
                <Button onClick={onRegister}>Sign Up</Button>
            </Form>
            <Link to="/login">Already have an account?</Link>
        </Card>
    );
}

export default Signup;