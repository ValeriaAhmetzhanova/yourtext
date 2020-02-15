import React, { Component } from 'react';
import HeaderComponent from './HeaderComponent';
import MainPageComponent from './MainPageComponent';
import ProfileComponent from "./ProfileComponent";
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Login from "./Login";
import PrivateRoute from "../PrivateRoute";
import Signup from "./SingnUp";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        console.log("token is" + this.props.token);
        return (
            <div>
                <HeaderComponent token={this.props.token}/>
                <Switch>
                    <Route path="/main" component={() => <MainPageComponent/>} />} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute path="/profile" component={ProfileComponent} />
                    <Redirect to="/main" />
                </Switch>
            </div>
        );
    }
}

export default Main;