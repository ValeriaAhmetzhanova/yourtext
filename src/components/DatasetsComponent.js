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
            currentEditId: '',
            currentEditTitle: '',
            newDatasetTitle: '',
            newDatasetText: '',
            editedDatasetText: '',
            previousDatasetText: '',
            token: this.props.token,
            datasets: [],
            datasetsLoading: true,
            createMode: 'file',
            uploadPercentage: 0,
            datasetIsLoading: true,
            datasetLoadingPercentage: 0.0,
            deleteDatasetModalShow: false
        };
        this.toggleDatasetModal = this.toggleDatasetModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);

        // this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleDelete = this.handleDelete.bind(this);
        this.loadDatasets = this.loadDatasets.bind(this);

        // this.showFileUpload = this.showFileUpload.bind(this);
        // this.showTextArea = this.showTextArea.bind(this);

        // this.onUploadSuccess = this.onUploadSuccess.bind(this);
    }

    resetDatasetState(){
        this.setState({
            currentEditId: '',
            currentEditTitle: '',
            newDatasetTitle: '',
            newDatasetText: '',
            editedDatasetText: '',
            previousDatasetText: '',
            datasetIsLoading: true,
            datasetLoadingPercentage: 0.0
        });
    }

    componentDidMount(){
        this.loadDatasets();
    }

    toggleDatasetModal(){
        // toast("Wow so easy !");
        // this.resetDatasetState();
        this.setState({newDatasetModalShow: !this.state.newDatasetModalShow});
    }

    toggleEditModal(dataset){

        // this.resetDatasetState();
        // if (!this.state.editDatasetModalShow) {
        //     this.loadDataset(id);
        // } 
        this.setState({
            editDatasetModalShow: !this.state.editDatasetModalShow,
            editDataset: dataset
            // currentEditId: id,
            // currentEditTitle: title
        });
    }
    
    toggleDeleteModal(dataset) {
        this.setState({
            deleteDataset: dataset,
            deleteDatasetModalShow: !this.state.deleteDatasetModalShow,
        });
    }

    // handleInputChange(event) {
    //     const target = event.target;
    //     let value = null;

    //     if (target.type === 'file') {
    //         value = target.files[0];
    //     } else if (target.type === 'checkbox') {
    //         value = target.checked;
    //     } else {
    //         value = target.value;
    //     }

    //     const name = target.name;

    //     this.setState({
    //         [name]: value
    //     });
    // }

    // handleSubmit(event) {

    //     // console.log(this.state.mode);

    //     if (this.state.createMode === 'file')  {
    //         const title = this.state.newDatasetTitle;
    //         const file = this.state.newDatasetFile;

    //         console.log(title, file);

    //         if (title !== '' && file !== null) {
    //             this.uploadFileDataset(title, file);
    //         }

    //     } else {
    //         const title = this.state.newDatasetTitle;
    //         const text = this.state.newDatasetText;

    //         if (title !== '' && text !== '') {
    //             this.uploadTextDataset(title, text);
    //         }
    //     }        
    // }

    // handleDelete(id) {
    //     toast.warn("Deleting " + id);
    // }

    handleEdit(id) {
        var text = this.state.editedDatasetText;
        if (text !== '' && id) {
            this.updateDataset(id, text);
        }
    }

    loadDataset(id){
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
                    datasetLoadingPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                })
            }.bind(this)
        })
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        datasetIsLoading: false,
                        previousDatasetText: response.data.data.text
                    });
                }
                else {
                    toast.error(response.data.text);
                }
            })
            .catch(response => {
                toast.error(response);
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

    // uploadFileDataset(title, file) {
    //     const url = 'http://169.60.115.39:8888/datasets/upload/file';

    //     var data = new FormData();

    //     data.append("file", file);
    //     data.append("title", title);


    //     this.setState({
    //         createMode: 'uploading'
    //     });

    //     axios({
    //         method: 'post',
    //         url: url,
    //         data: data,
    //         headers: { 
    //             'Content-Type': 'multipart/form-data', 
    //             'Authorization': 'Bearer ' + this.state.token,
    //         },
    //         onUploadProgress: function (progressEvent) {
    //             this.setState({
    //                 uploadPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)) 
    //             })
    //         }.bind(this)
    //     })
    //         .then(response => {
    //             if (response.data.success) {
    //                 this.onUploadSuccess(response);
    //             }
    //             else {
    //                 this.onUploadError(response);
    //             }
    //         })
    //         .catch(response => {
    //             //handle error
    //             // console.log(response);
    //             toast.error(response);
    //         });
    // }

    // uploadTextDataset(title, data) {
    //     var url = 'http://169.60.115.39:8888/datasets/upload/text';


    //     var params = {
    //         "title": title,
    //         "text": data,
    //     };

    //     this.setState({
    //         createMode: 'uploading'
    //     });


    //     axios({
    //         method: 'post',
    //         url: url,
    //         data: params,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + this.state.token,
    //         },
    //         onUploadProgress: function (progressEvent) {
    //             this.setState({
    //                 uploadPercentage: parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
    //             })
    //         }.bind(this)
    //     })
    //         .then(response => {
    //             if (response.data.success) {
    //                 this.onUploadSuccess(response);
    //             }
    //             else {
    //                 this.onUploadError(response);
    //             }
    //         })
    //         .catch(response => {
    //             //handle error
    //             // console.log(response);
    //             toast.error(response);
    //         });
    // }


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


    // showFileUpload() {
    //     this.setState({
    //         createMode: 'file'
    //     })
    // }

    // showTextArea() {
    //     this.setState({
    //         createMode: 'text'
    //     })
    // }

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

                // let modalBody = null;
                // let modalFooter = null;
                // let show = this.state.editDatasetModalShow && id === this.state.currentEditId;

                // if (this.state.datasetIsLoading) {
                //     modalBody = 
                //         <Modal.Body>
                //             <Form.Group controlId={"formGroupText" + id}>
                //                 <Form.Label>Loading...</Form.Label>
                //                 <ProgressBar animated now={this.state.datasetLoadingPercentage}
                //                     label={`${this.state.datasetLoadingPercentage}%`} />
                //             </Form.Group>
                //         </Modal.Body>
                // } else {
                //     modalBody = 
                //         <Modal.Body>
                //             <Form onSubmit={this.handleEdit}>
                //                 <Form.Group controlId={"formGroupText" + id}>
                //                     <Form.Label>Text</Form.Label>
                //                     <Form.Control required
                //                         as="textarea"
                //                         rows="10"
                //                         name={'editedDatasetText'}
                //                         onChange={this.handleInputChange}
                //                         defaultValue={this.state.previousDatasetText}
                //                     />
                //                 </Form.Group>
                //             </Form>
                //         </Modal.Body>

                //     modalFooter = 
                //         <Modal.Footer>
                //             <Button type={"submit"} variant="primary" onClick={() => this.handleEdit(this.state.currentEditId)}>Save changes</Button>
                //         </Modal.Footer>
                // }

                // let showDeleteDialog = this.state.deleteDatasetModalShow && id === this.state.currentDeleteId;

                return (
                    <Card className={"col-4 dataset-card"} key={dataset.meta._id}>
                        <Card.Body>{title}</Card.Body>
                        <span onClick={() => {
                            this.toggleEditModal(dataset);
                        }}>edit</span>
                        <span onClick={() => this.toggleDeleteModal(dataset)}>delete</span>
                        {/* <Modal
                            show={show}
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
                            {modalBody}
                            {modalFooter}
                        </Modal> */}
                        {/* <Modal
                            show={showDeleteDialog}
                            onHide={() => this.toggleDeleteModal(id, title)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton />
                            <Modal.Body>
                                Are you sure you want to delete "{title}" dataset?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={() => this.handleDelete(id)}>Delete</Button>
                                <Button variant="primary" onClick={() => this.toggleDeleteModal(id, title)}>Cancel</Button>
                            </Modal.Footer>
                        </Modal> */}
                    </Card>
                );
            });

            // let modalBody = null;
            // let modalFooter = null;

            // if (this.state.createMode === 'uploading') {
            //     let progress = this.state.uploadPercentage;
            //     modalBody = 
            //         // <Form.Label>Uploading... {progress}</Form.Label>
            //         <Modal.Body>
            //             <Form.Label>Uploading, please don't close the tab</Form.Label>
            //             <ProgressBar animated now={progress} label={`${progress}%`} />
            //         </Modal.Body>
                    
            // } else {
            //     let datasetSource = null;

            //     if (this.state.createMode === 'file') {
            //         datasetSource =
            //             <Form.Group controlId="formGroupText">
            //                 <Form.Label>File</Form.Label>
            //                 <Form.Control required
            //                     as="input"
            //                     type="file"
            //                     name={'newDatasetFile'}
            //                     onChange={this.handleInputChange}
            //                     accept=".txt"
            //                 />
            //             </Form.Group>

            //     } else if (this.state.createMode === 'text') {
            //         datasetSource =
            //             <Form.Group controlId="formGroupText">
            //                 <Form.Label>Text</Form.Label>
            //                 <Form.Control required
            //                     as="textarea"
            //                     rows="10"
            //                     name={'newDatasetText'}
            //                     onChange={this.handleInputChange}
            //                 />
            //             </Form.Group>
            //     }

            //     modalBody = 
            //         <Modal.Body>
            //             <Form onSubmit={this.handleSubmit}>
            //                 <Form.Group controlId="formGroupTitle">
            //                     <Form.Label>Title</Form.Label>
            //                     <Form.Control required
            //                         type="text"
            //                         placeholder="Title"
            //                         name={'newDatasetTitle'}
            //                         onChange={this.handleInputChange}
            //                     />
            //                 </Form.Group>
            //                 <ButtonGroup size="sm" className="mt-3">
            //                     <Button variant="secondary" onClick={() => this.showFileUpload()}>Upload File</Button>
            //                     <Button variant="secondary" onClick={() => this.showTextArea()}>Paste Text</Button>
            //                 </ButtonGroup>
            //                 {datasetSource}
            //             </Form>
            //         </Modal.Body>

            //     modalFooter = 
            //         <Modal.Footer>
            //             <Button type={"submit"} variant="primary" onClick={() => this.handleSubmit()}>Save changes</Button>
            //         </Modal.Footer>

            // }

            let editDatasetModal = null;

            if (this.state.editDatasetModalShow) {
                editDatasetModal = <EditDataset
                    show={true}
                    dataset={this.state.editDataset}
                    onHide={() => {
                        this.toggleEditModal(null);
                    }}
                    onSuccess={(response) => {
                        // this.onUploadSuccess(response)
                        this.onEditSuccess(response);
                    }}
                    onError={(response) => {
                        // this.onUploadError(response)
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
                                {/* <Modal
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
                                    {modalBody}
                                    {modalFooter}                                   
                                </Modal> */}
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