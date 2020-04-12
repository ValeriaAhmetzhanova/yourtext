import React, { Component } from 'react';
import { Button, 
         ButtonGroup, 
         ButtonToolbar, 
         Card, Form, Modal,
         ProgressBar, Spinner, 
        } from "react-bootstrap";

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DeleteDataset from './DeleteDataset'
import CreateDataset from './CreateDataset'
import EditDataset from './EditDataset'

class DatasetsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newDatasetModalShow: false,
            editDatasetModalShow: false,
            deleteDatasetModalShow: false,
            datasetsLoading: true,
            token: this.props.token,
            datasets: [],
        };
        this.toggleDatasetModal = this.toggleDatasetModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.loadDatasets = this.loadDatasets.bind(this);
    }

    componentDidMount(){
        this.loadDatasets();
    }

    toggleDatasetModal(){
        this.setState({newDatasetModalShow: !this.state.newDatasetModalShow});
    }

    toggleEditModal(dataset){
        this.setState({
            editDatasetModalShow: !this.state.editDatasetModalShow,
            editDataset: dataset
        });
    }
    
    toggleDeleteModal(dataset) {
        this.setState({
            deleteDataset: dataset,
            deleteDatasetModalShow: !this.state.deleteDatasetModalShow,
        });
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

    onUploadSuccess(response) {
        toast.info("Dataset " + response.data.data.meta.title + " created!");

        this.toggleDatasetModal();
        this.loadDatasets();
    }

    onUploadError(response) {
        toast.error(response.data.text);

        this.toggleDatasetModal();
        this.loadDatasets();
    }

    onEditError(response) {
        toast.error(response.data.text);
    }

    onEditSuccess(response) {
        toast.info("Dataset " + response.data.data.meta.title + " updated!");
        this.toggleEditModal();
    }

    updateDataset(id, data) {
        var url = 'http://169.60.115.39:8888/datasets/' + id + '/update';

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
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        } else {
            const datasets = this.state.datasets.map((dataset) => {
                var id = dataset.meta._id;
                var title = dataset.meta.title;


                return (
                    <Card style={{ width: '18rem', textAlign: "left"}} className={"col-4 dataset-card"} key={dataset.meta._id}>
                        <Card.Body>
                            <Card.Title>{title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Created {dataset.meta.date_created}</Card.Subtitle>
                            <Card.Text>Preview: "{dataset.meta.preview}"</Card.Text>
                            <Button variant="primary" onClick={() => {
                                this.toggleEditModal(dataset);
                            }}>Edit</Button>
                            <Button variant="danger" onClick={() => {
                                this.toggleDeleteModal(dataset)
                            }}>Delete</Button>
                        </Card.Body>
                        {/* <span onClick={() => {
                            this.toggleEditModal(dataset);
                        }}>edit</span>
                        <span onClick={() => this.toggleDeleteModal(dataset)}>delete</span> */}
                    </Card>
                );
            });

            let editDatasetModal = null;

            if (this.state.editDatasetModalShow) {
                editDatasetModal = <EditDataset
                    show={true}
                    dataset={this.state.editDataset}
                    onHide={() => {
                        this.toggleEditModal(null);
                    }}
                    onSuccess={(response) => {
                        this.onEditSuccess(response);
                    }}
                    onError={(response) => {
                        this.onEditError(response);
                    }}
                    token={this.state.token}
                />;
            }

            let createDatasetModal = null; 

            if (this.state.newDatasetModalShow) {
                createDatasetModal = <CreateDataset 
                    show={true}
                    onHide={() => {
                        this.toggleDatasetModal();
                    }}
                    onSuccess={(response) => {
                        this.onUploadSuccess(response)
                    }}
                    onError={(response) => {
                        this.onUploadError(response)
                    }}
                    token={this.state.token}
                />;
            }

            let deleteDatasetModal = null;

            if (this.state.deleteDatasetModalShow) {
                deleteDatasetModal = <DeleteDataset
                    show={true}
                    dataset={this.state.deleteDataset}
                    onHide={() => {
                        this.toggleDeleteModal(null);
                    }}
                    token={this.state.token}
                    onDelete={(response) => {
                        this.toggleDeleteModal(null);

                        if (response.data.success) {
                            toast.info("Success!")
                            this.loadDatasets();
                        } else {
                            toast.error(response.data.text)
                        }
                    }}
                />;
            }

            return (
                <div>
                    <ToastContainer />
                    {deleteDatasetModal}
                    {createDatasetModal}
                    {editDatasetModal}
                    <div className={"p-3"}>
                        <div className={"row mt-4"}>
                            <h2 className={"m-3"}>My Datasets</h2>
                            <ButtonToolbar>
                                <Button variant="primary" onClick={() => this.toggleDatasetModal()}>
                                    New
                                </Button>
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