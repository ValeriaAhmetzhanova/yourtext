import React, { Component } from "react";

import {
    Button, Modal, Spinner,
} from "react-bootstrap";

import axios from 'axios';

class DeleteDataset extends Component {
    constructor(props) {

        super(props);
        
        this.state = {
            dataset: props.dataset,
            show: props.show,
            onDelete: props.onDelete,
            onHide:props.onHide,
            inProgress: false,
            token: props.token
        };
    }

    handleDelete() {
        console.log("Deleting " + this.state.dataset.meta._id);

        let id = this.state.dataset.meta._id;

        this.setState({
            inProgress: true
        });

        var url = 'http://169.60.115.39:8888/datasets/' + id + '/delete';

        axios(url, {
            method: 'post', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then(response => {
                this.state.onDelete(response);
            })
            .catch(error => console.log(error));



    }

    toggleModal() {
        this.setState({
            show: !this.state.show
        })
        this.state.onHide(this.state.show);
    }

    render() {

        let footer = null;

        if (this.state.inProgress) {
            footer = 
                <Modal.Footer>
                    <Button variant="danger" disabled>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Working...
                    </Button>
                    <Button variant="primary" disabled >Cancel</Button>
                </Modal.Footer>
        } else {
            footer = 
                <Modal.Footer>
                    <Button variant="danger" onClick={() => this.handleDelete()}>Delete</Button>
                    <Button variant="primary" onClick={() => this.toggleModal()}>Cancel</Button>
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
                <Modal.Header closeButton />
                <Modal.Body>
                    Are you sure you want to delete "{this.state.dataset.meta.title}" dataset?
                </Modal.Body>
                {footer}
            </Modal>
        );
        
    }
}

export default DeleteDataset;