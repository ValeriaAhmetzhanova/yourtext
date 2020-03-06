import React, { Component } from 'react';
import { Button, ButtonToolbar} from "react-bootstrap";
import { Redirect } from 'react-router-dom'

class SettingsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logoutModalShow: false,
            token: this.props.token,
            toLogin: false
        };
    }

    logout() {
        var url = 'http://169.60.115.39:8888/logout';

        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit

            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            },

            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    localStorage.removeItem("token");
                    this.setState({
                        toLogin: true
                    })
                    
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }


    render() {
        if (this.state.toLogin === true) {
            return <Redirect to='/login' />
        } else {
            return (
                <div>
                    <div className={"p-3"}>
                        <div className={"row mt-4"}>
                            <h2 className={"m-3"}>Settings</h2>
                            <ButtonToolbar>
                                <Button variant="primary" onClick={() => this.logout()}>
                                    Logout
                            </Button>
                            </ButtonToolbar>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SettingsComponent;