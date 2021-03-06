import React, { Component } from 'react';
import { Button, ButtonGroup } from "react-bootstrap";

import DatasetsComponent from "./DatasetsComponent";
import ModelsComponent from "./ModelsComponent";
import SettingsComponent from "./SettingsComponent";
import {NavLink} from "react-router-dom";


class ProfileComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            selected: 'datasets',
        };
    }

    showModels() {
        this.setState({ selected: 'models'})
    }

    showDatasets() {
        this.setState({ selected: 'datasets'})
    }
    
    showProfile() {
        this.setState({ selected: 'settings' })
    }

    render() {
        var page;
        if (this.state.selected === 'models') {
            page = <ModelsComponent token={this.state.token}/>;
        }
        else if (this.state.selected === 'datasets'){
            page = <DatasetsComponent token={this.state.token}/>;
        }
        else if (this.state.selected === 'settings') {
            page = <SettingsComponent token={this.state.token} />;
        }

        return(
            <div style={{textAlign:"center"}}>
                <ButtonGroup size="sm" className="mt-3">
                    <Button variant="secondary" onClick={() => this.showDatasets()}>My Datasets</Button>
                    <Button variant="secondary" onClick={() => this.showModels()}>My Models</Button>
                    <Button variant="secondary"><NavLink className="text-white" to='/main'>Generate text </NavLink></Button>
                    <Button variant="secondary" onClick={() => this.showProfile()}>Profile Settings</Button>
                </ButtonGroup>
                {page}
            </div>
        )
    }
}

export default ProfileComponent;