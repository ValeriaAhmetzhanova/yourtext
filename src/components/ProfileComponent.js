import React, { Component } from 'react';
import DatasetsComponent from "./DatasetsComponent";
import {Breadcrumb, Button, ButtonGroup} from "react-bootstrap";
import ModelsComponent from "./ModelsComponent";


class ProfileComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            chosen: '',
        };
    }

    choseModels() {
        this.setState({chosen: 'MyModels'})
    }

    choseDatasets() {
        this.setState({chosen: 'MyDatasets'})
    }

    render() {
        var page;
        if (this.state.chosen === 'MyModels') {
            page = <ModelsComponent/>;
        }
        else if (this.state.chosen === 'MyDatasets'){
            page = <DatasetsComponent token={this.state.token}/>;
        }

        return(
            <div>
                <ButtonGroup size="sm" className="mt-3">
                    <Button variant="secondary" onClick={() => this.choseDatasets()}>My Datasets</Button>
                    <Button variant="secondary" onClick={() => this.choseModels()}>My Models</Button>
                </ButtonGroup>
                {page}
            </div>
        )
    }
}

export default ProfileComponent;