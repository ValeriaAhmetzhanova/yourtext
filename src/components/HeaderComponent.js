import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class HeaderComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render (){
        var navigation;
        if (this.props.token) {
            navigation =  (
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul id="navigation-list" className="navbar-nav ml-auto">
                        <li className="nav-item"><NavLink className="nav-link" to='/profile'>Profile</NavLink></li>
                    </ul>
                </div>
            );
        }
        else {
            navigation = (
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul id="navigation-list" className="navbar-nav ml-auto">
                        <li  className="nav-item"><NavLink className="nav-link" to='/login'>Authorize</NavLink></li>
                    </ul>
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