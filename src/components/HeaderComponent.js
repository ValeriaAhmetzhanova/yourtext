import React, { Component } from 'react';
import ReactModalLogin from "react-modal-login";
import { NavLink } from 'react-router-dom';

class HeaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            loading: false,
            error: null,
            authorized: false
        };
        this.toggleAuthorized = this.toggleAuthorized.bind(this);
    }

    onLogin() {
        console.log('__onLogin__');
        console.log('email: ' + document.querySelector('#login').value);
        console.log('password: ' + document.querySelector('#password').value);

        const username = document.querySelector('#login').value;
        const password = document.querySelector('#password').value;

        if (!username|| !password) {
            this.setState({
                error: true
            })
        } else {
            this.postLogin(username, password);
        }
    }

    onRegister() {
        console.log('__onRegister__');
        console.log('login: ' + document.querySelector('#login').value);
        console.log('email: ' + document.querySelector('#email').value);
        console.log('password: ' + document.querySelector('#password').value);

        const login = document.querySelector('#login').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!login || !email || !password) {
            this.setState({
                error: true
            })
        } else {
            this.postRegistration(login, email, password);
        }
    }

    onRecoverPassword() {
        console.log('__onFotgottenPassword__');
        console.log('email: ' + document.querySelector('#email').value);

        const email = document.querySelector('#email').value;


        if (!email) {
            this.setState({
                error: true,
                recoverPasswordSuccess: false
            })
        } else {
            this.setState({
                error: null,
                recoverPasswordSuccess: true
            });
        }
    }

    openModal() {
        this.setState({
            showModal: true
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
            error: null
        });
    }

    onLoginSuccess(method, response) {
        console.log("logged successfully with " + method);
    }

    onLoginFail(method, response) {
        console.log("logging failed with " + method);
        this.setState({
            error: response
        });
    }

    startLoading() {
        this.setState({
            loading: true
        });
    }

    finishLoading() {
        this.setState({
            loading: false
        });
    }

    afterTabsChange() {
        this.setState({
            error: null
        });
    }

    toggleAuthorized() {
        this.setState({authorized: true});
    }

    postLogin(usn, pswd){
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
                    this.toggleAuthorized()
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    postRegistration(usn, em, pswd){
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
                }
            }
        };
        http.send(JSON.stringify(params));
    }

    render (){
        var navigation;
        console.log(this.state.authorized);
        if (this.state.authorized) {
            navigation =  (
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul id="navigation-list" className="navbar-nav ml-auto">
                            <li  className="nav-item"><NavLink className="nav-link" to='/profile'>Profile</NavLink></li>
                        </ul>
                    </div>

            );
        }
        else {
            navigation = (
                    <div>
                        <button id="signup" className="btn btn-outline-success" onClick={() => this.openModal()}>
                            Sign in
                        </button>
                        <ReactModalLogin
                            visible={this.state.showModal}
                            onCloseModal={this.closeModal.bind(this)}
                            loading={this.state.loading}
                            error={this.state.error}
                            tabs={{
                                afterChange: this.afterTabsChange.bind(this)
                            }}
                            loginError={{
                                label: "Couldn't sign in, please try again."
                            }}
                            registerError={{
                                label: "Couldn't sign up, please try again."
                            }}
                            startLoading={this.startLoading.bind(this)}
                            finishLoading={this.finishLoading.bind(this)}
                            form={{
                                onLogin: this.onLogin.bind(this),
                                onRegister: this.onRegister.bind(this),
                                onRecoverPassword: this.onRecoverPassword.bind(this),

                                recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
                                    ? {
                                        label: "New password has been sent to your mailbox!"
                                    }
                                    : null,
                                recoverPasswordAnchor: {
                                    label: "Forgot your password?"
                                },
                                loginBtn: {
                                    label: "Sign in"
                                },
                                registerBtn: {
                                    label: "Sign up"
                                },
                                recoverPasswordBtn: {
                                    label: "Send new password"
                                },
                                loginInputs: [
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Username',
                                        type: 'text',
                                        inputClass: 'RML-form-control',
                                        id: 'login',
                                        name: 'login',
                                        placeholder: 'Username',
                                    },
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Password',
                                        type: 'password',
                                        inputClass: 'RML-form-control',
                                        id: 'password',
                                        name: 'password',
                                        placeholder: 'Password',
                                    }
                                ],
                                registerInputs: [
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Username',
                                        type: 'text',
                                        inputClass: 'RML-form-control',
                                        id: 'login',
                                        name: 'login',
                                        placeholder: 'Username',
                                    },
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Email',
                                        type: 'email',
                                        inputClass: 'RML-form-control',
                                        id: 'email',
                                        name: 'email',
                                        placeholder: 'Email',
                                    },
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Password',
                                        type: 'password',
                                        inputClass: 'RML-form-control',
                                        id: 'password',
                                        name: 'password',
                                        placeholder: 'Password',
                                    }
                                ],
                                recoverPasswordInputs: [
                                    {
                                        containerClass: 'RML-form-group',
                                        label: 'Email',
                                        type: 'email',
                                        inputClass: 'RML-form-control',
                                        id: 'email',
                                        name: 'email',
                                        placeholder: 'Email',
                                    },
                                ],
                            }}
                        >

                        </ReactModalLogin>
                    </div>
            );
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
                <div className="container">
                    <NavLink className="navbar-brand" to='/'>Your Text</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    {navigation}
                </div>
            </nav>
        );
    }
}

export default HeaderComponent;