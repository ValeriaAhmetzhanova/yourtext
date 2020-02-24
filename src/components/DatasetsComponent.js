import React, { Component } from 'react';
import {Button, ButtonToolbar, Card, Form, Modal} from "react-bootstrap";


class DatasetsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newDatasetModalShow: false,
            editDatasetModalShow: false,
            currentEditId: '',
            currentEditTitle: '',
            newDatasetTitle: '',
            newDatasetText: '',
            editedDatasetText: '',
            previousDatasetText: '',
            token: this.props.token,
            datasets: [],
            datasetsLoading: true
        };
        this.toggleDatasetModal = this.toggleDatasetModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadDatasets = this.loadDatasets.bind(this);
    }

    resetDatasetState(){
        this.setState({
            currentEditId: '',
            currentEditTitle: '',
            newDatasetTitle: '',
            newDatasetText: '',
            editedDatasetText: '',
            previousDatasetText: '',
        });
    }

    componentDidMount(){
        this.loadDatasets();
    }

    toggleDatasetModal(){
        this.resetDatasetState();
        this.setState({newDatasetModalShow: !this.state.newDatasetModalShow});
    }

    toggleEditModal(id, title){
        this.resetDatasetState();
        if (!this.state.editDatasetModalShow){
            this.loadPreviousText(id);
        }
        this.setState({
            editDatasetModalShow: !this.state.editDatasetModalShow,
            currentEditId: id,
            currentEditTitle: title,
        });
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

    handleEdit(id) {
        var text = this.state.editedDatasetText;
        if (text !== '' && id) {
            this.sendEditDataset(id, text);
        }
    }

    loadPreviousText(id){
        var url = 'http://169.60.115.39:8888/datasets/' + id;

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
                        previousDatasetText: response.data.text
                    });
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    loadDatasets(){
        var url = 'http://169.60.115.39:8888/datasets';

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
                        datasets: response.data,
                        datasetsLoading: false
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
                    this.loadDatasets();
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    sendEditDataset(id, data) {
        var url = 'http://169.60.115.39:8888/update/small';
        var params = {
            "dataset_id": id,
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
                    this.toggleEditModal();
                }
                else {
                    alert(response.text);
                }})
            .catch(error => console.log(error));
    }

    render() {
        if (this.state.datasetsLoading) {
            return(
                <div>
                    Loading...
                </div>
            );
        }
        else {
            const datasets = this.state.datasets.map((dataset) => {
                var id = dataset.meta._id;
                var title = dataset.meta.title;
                return (
                    <Card className={"col-4 dataset-card"} key={dataset.meta._id}>
                        <Card.Body>{title}</Card.Body>
                        <span onClick={() => this.toggleEditModal(id, title)}>edit</span>
                        <Modal
                            show={this.state.editDatasetModalShow}
                            onHide={() => this.toggleEditModal(id, title)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Edit {this.state.currentEditTitle} dataset
                            </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={this.handleEdit}>
                                    <Form.Group controlId={"formGroupText" + id}>
                                        <Form.Label>Text</Form.Label>
                                        <Form.Control required
                                            as="textarea"
                                            rows="10"
                                            name={'editedDatasetText'}
                                            onChange={this.handleInputChange}
                                            defaultValue={this.state.previousDatasetText}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type={"submit"} variant="primary" onClick={() => this.handleEdit(this.state.currentEditId)}>Save changes</Button>
                            </Modal.Footer>
                        </Modal>

                    </Card>
                );
            });

            return (
                <div>
                    <div className={"p-3"}>
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
}

export default DatasetsComponent;