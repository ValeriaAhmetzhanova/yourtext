import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import MainPageComponent from './MainPageComponent';
import ProfileComponent from "./ProfileComponent";
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <HeaderComponent/>
                <Switch>
                    <Route path="/main" component={() => <MainPageComponent/>} />} />
                    <Route path="/profile" component={() => <ProfileComponent/>} />} />
                    <Redirect to="/main" />
                </Switch>
            </div>
        );
    }
}

export default Main;