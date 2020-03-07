import React, { Component } from "react";

import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card, Form, Modal,
    ProgressBar, Spinner,
} from "react-bootstrap";

import axios from 'axios';

class EditDataset extends Component {
    constructor(props) {

        super(props);

        this.state = {
            show: props.show,
            onHide: props.onHide,
            token: props.token,
            mode: 'downloading',
            uploadPercentage: 0,
            downloadPercentage: 0,
            onSuccess: props.onSuccess,
            onError: props.onError,
            loading: false,
            dataset: props.dataset
        };

        this.handleInputChange = this.handleInputChange.bind(this);

        this.loadDataset(this.state.dataset.meta._id);
    }

    handleUpdate() {
        const text = this.state.editedDatasetText;
        const id = this.state.dataset.meta._id;

        if (text !== '' && id) {
            this.updateDataset(id, text);
        }
    }

    updateDataset(id, data) {
        var url = 'http://169.60.115.39:8888/datasets/' + id + '/update';

        var params = {
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
                this.onUploadError(response);
            });
    }

    loadDataset(id) {
        var url = 'http://169.60.115.39:8888/datasets/' + id;

        axios({
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.state.token,
            },
            onDownloadProgress: function (progressEvent) {
                this.setState({
                    downloadPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                })
            }.bind(this)
        })
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        mode: "ready",
                        datasetText: response.data.data.text
                    });
                }
                else {
                    // toast.error(response.data.text);
                    this.onUploadError(response);
                }
            })
            .catch(response => {
                // toast.error(response);
                this.onUploadError(response);
            });
    }

    handleInputChange(event) {
        const target = event.target;

        const value = target.value;;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })

        this.state.onHide(this.state.show);
    }

    onUploadSuccess(response) {
        this.state.onSuccess(response);
    }

    onUploadError(response) {
        this.state.onError(response);
    }

    render() {

        let modalBody = null;
        let modalFooter = null;
        // let show = this.state.editDatasetModalShow && id === this.state.currentEditId;

        if (this.state.mode === 'downloading') {
            modalBody =
                <Modal.Body>
                    <Form.Group controlId={"formGroupText"}>
                        <Form.Label>Loading...</Form.Label>
                        <ProgressBar animated now={this.state.downloadPercentage}
                            label={`${this.state.downloadPercentage}%`} />
                    </Form.Group>
                </Modal.Body>
        } else if (this.state.mode === 'uploading') {
            modalBody =
                <Modal.Body>
                    <Form.Group controlId={"formGroupText"}>
                        <Form.Label>Updating...</Form.Label>
                        <ProgressBar animated now={this.state.uploadPercentage}
                            label={`${this.state.uploadPercentage}%`} />
                    </Form.Group>
                </Modal.Body>
        } else {
            modalBody =
                <Modal.Body>
                    <Form onSubmit={this.handleEdit}>
                        <Form.Group controlId={"formGroupText"}>
                            <Form.Label>Text</Form.Label>
                            <Form.Control required
                                as="textarea"
                                rows="10"
                                name={'editedDatasetText'}
                                onChange={this.handleInputChange}
                                defaultValue={this.state.datasetText}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

            modalFooter =
                <Modal.Footer>
                    <Button type={"submit"} variant="primary" onClick={() => this.handleUpdate()}>Save changes</Button>
                </Modal.Footer>
        }

        return (
            <Modal
                show={true}
                onHide={() => this.toggleModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit {this.state.dataset.meta.title} dataset
                            </Modal.Title>
                </Modal.Header>
                {modalBody}
                {modalFooter}
            </Modal>
        );
    }
}

export default EditDataset;