import React, { Component } from "react";

import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card, Form, Modal,
    ProgressBar, Spinner,
} from "react-bootstrap";

import axios from 'axios';

class CreateDataset extends Component {
    constructor(props) {

        super(props);

        this.state = {
            show: props.show,
            onHide: props.onHide,
            token: props.token,
            mode: 'file',
            uploadPercentage: 0,
            onSuccess: props.onSuccess,
            onError: props.onError,  
            
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.uploadFileDataset = this.uploadFileDataset.bind(this);
        this.uploadTextDataset = this.uploadTextDataset.bind(this);
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
                }
            })
            .catch(error => console.log(error));
    }

    handleInputChange(event) {
        const target = event.target;
        let value = null;

        if (target.type === 'file') {
            value = target.files[0];
        } else if (target.type === 'checkbox') {
            value = target.checked;
        } else {
            value = target.value;
        }

        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        console.log("submit", this.state.mode);

        if (this.state.mode === 'file') {
            const title = this.state.newDatasetTitle;
            const file = this.state.newDatasetFile;

            if (title !== '' && file !== null) {
                this.uploadFileDataset(title, file);
            }

        } else {
            const title = this.state.newDatasetTitle;
            const text = this.state.newDatasetText;

            if (title !== '' && text !== '') {
                this.uploadTextDataset(title, text);
            }
        }    
    }

    toggleModal () {
        this.setState({
            show: !this.state.show
        })

        this.state.onHide(this.state.show);
    }

    showFileUpload() {
        this.setState({
            mode: 'file'
        })
    }

    showTextArea() {
        this.setState({
            mode: 'text'
        })
    }

    onUploadSuccess(response) {
        // toast.info("Dataset " + response.data.data.meta.title + " created!");

        // this.toggleDatasetModal();
        // this.loadDatasets();
        // console.log("success", response);
        this.state.onSuccess(response);
    }

    onUploadError(response) {
        // toast.error(response.data.text);

        // this.toggleDatasetModal();
        // this.loadDatasets();
        // console.log("error", response);
        this.state.onError(response);
    }

    uploadFileDataset(title, file) {
        const url = 'http://169.60.115.39:8888/datasets/upload/file';

        var data = new FormData();

        data.append("file", file);
        data.append("title", title);


        this.setState({
            mode: 'uploading'
        });

        axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token,
            },
            onUploadProgress: function (progressEvent) {
                this.setState({
                    uploadPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                })
            }.bind(this)
        })
            .then(response => {
                if (response.data.success) {
                    this.onUploadSuccess(response);
                }
                else {
                    this.onUploadError(response);
                }
            })
            .catch(response => {
                //handle error
                // console.log(response);
                this.onUploadError(response);
                // toast.error(response);
            });
    }

    uploadTextDataset(title, data) {
        var url = 'http://169.60.115.39:8888/datasets/upload/text';


        var params = {
            "title": title,
            "text": data,
        };

        this.setState({
            mode: 'uploading'
        });


        axios({
            method: 'post',
            url: url,
            data: params,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            },
            onUploadProgress: function (progressEvent) {
                this.setState({
                    uploadPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                })
            }.bind(this)
        })
            .then(response => {
                if (response.data.success) {
                    this.onUploadSuccess(response);
                }
                else {
                    this.onUploadError(response);
                }
            })
            .catch(response => {
                //handle error
                // console.log(response);
                // toast.error(response);
            });
    }


    render () {

        let modalBody = null;
        let modalFooter = null;

        if (this.state.mode === 'uploading') {

            let progress = this.state.uploadPercentage;
            modalBody =
                <Modal.Body>
                    <Form.Label>Uploading, please don't close the tab</Form.Label>
                    <ProgressBar animated now={progress} label={`${progress}%`} />
                </Modal.Body>

        } else {
            let datasetSource = null;

            if (this.state.mode === 'file') {
                datasetSource =
                    <Form.Group controlId="formGroupText">
                        <Form.Label>File</Form.Label>
                        <Form.Control required
                            as="input"
                            type="file"
                            name={'newDatasetFile'}
                            onChange={this.handleInputChange}
                            accept=".txt"
                        />
                    </Form.Group>

            } else if (this.state.mode === 'text') {
                datasetSource =
                    <Form.Group controlId="formGroupText">
                        <Form.Label>Text</Form.Label>
                        <Form.Control required
                            as="textarea"
                            rows="10"
                            name={'newDatasetText'}
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
            }

            modalBody =
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
                        <ButtonGroup size="sm" className="mt-3">
                            <Button variant="secondary" onClick={() => this.showFileUpload()}>Upload File</Button>
                            <Button variant="secondary" onClick={() => this.showTextArea()}>Paste Text</Button>
                        </ButtonGroup>
                        {datasetSource}
                    </Form>
                </Modal.Body>

            modalFooter =
                <Modal.Footer>
                    <Button type={"submit"} variant="primary" onClick={() => this.handleSubmit()}>Save changes</Button>
                </Modal.Footer>

        }

        return (
            <Modal
                show={this.state.show}
                onHide={() => this.toggleModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create new dataset
                    </Modal.Title>
                </Modal.Header>
                {modalBody}
                {modalFooter}
            </Modal>
        );
    }
}

export default CreateDataset;