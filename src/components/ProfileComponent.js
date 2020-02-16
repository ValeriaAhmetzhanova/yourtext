import React, { Component } from 'react';
import {Button, ButtonToolbar, Card, Form, Modal} from "react-bootstrap";


class ProfileComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newDatasetModalShow: false,
            newDatasetTitle: '',
            newDatasetText: '',
            token: this.props.token,
            datasets: []
        };
        this.toggleDatasetModal = this.toggleDatasetModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadDatasets = this.loadDatasets.bind(this);
    }

    componentDidMount(){
        this.loadDatasets();
    }

    toggleDatasetModal(){
        this.setState({newDatasetModalShow: !this.state.newDatasetModalShow});
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        var title = this.state.newDatasetTitle;
        var text = this.state.newDatasetText;
        if (title !== '' && text !== '') {
            this.sendNewDataset(title, text);
        }
    }

    loadDatasets(){
        var url = 'http://169.60.115.39:8888/datasets';
        var params = {
            "token": this.state.token
        };

        return fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
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
                    this.setState({
                        datasets: response.data
                    });
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    sendNewDataset(name, data) {
        var url = 'http://169.60.115.39:8888/upload/small';
        var params = {
            "title": name,
            "text": data,
        };

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
            body: JSON.stringify(params), // тип данных в body должен соответвовать значению заголовка "Content-Type"
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    alert("Success!");
                    this.toggleDatasetModal();
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    render() {
        console.log(this.state.datasets);
        const datasets = this.state.datasets.map((dataset) => {
            return (
                <Card className={"col-4 dataset-card"}>
                    <Card.Body>{dataset.meta.title}</Card.Body>
                </Card>
            );
        });

        return(
            <div>
                <div className={"col-md-6"}>
                    <div className={"row mt-4"}>
                        <h2 className={"m-3"}>My Datasets</h2>
                        <ButtonToolbar>
                            <Button variant="primary" onClick={() => this.toggleDatasetModal()}>
                                New
                            </Button>
                            <Modal
                                show={this.state.newDatasetModalShow}
                                onHide={() => this.toggleDatasetModal()}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        Create new dataset
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="formGroupTitle">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control required
                                                          type="text"
                                                          placeholder="Title"
                                                          name={'newDatasetTitle'}
                                                          onChange={this.handleInputChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formGroupText">
                                            <Form.Label>Text</Form.Label>
                                            <Form.Control required
                                                          as="textarea"
                                                          rows="10"
                                                          name={'newDatasetText'}
                                                          onChange={this.handleInputChange}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type={"submit"} variant="primary" onClick={() => this.handleSubmit()}>Save changes</Button>
                                </Modal.Footer>
                            </Modal>
                        </ButtonToolbar>
                    </div>
                    <div>
                        {datasets}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileComponent;