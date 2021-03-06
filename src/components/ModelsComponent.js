import React, { Component } from 'react';
import { Button, ButtonToolbar, Card, Form, Modal, Spinner } from "react-bootstrap";
import { Chart } from 'react-charts';
import ModelDetails from './ModelDetails'

class ModelsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newModelModalShow: false,
            newModelTitle: '',
            newModelArch: '',
            newModelDataset: '',
            detailsModalShow: false,
            selectedModel: null,
            token: this.props.token,
            models: [],
            archs: [],
            loadingArch: true,
            datasets: [],
            loadingDatasets: true
        };
        this.loadModels = this.loadModels.bind(this);
        this.loadArch = this.loadArch.bind(this);
        this.toggleModelModal = this.toggleModelModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadDatasets = this.loadDatasets.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // data = React.useMemo(
    //     () => [
    //         {
    //             label: 'Series 1',
    //             data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
    //         },
    //         {
    //             label: 'Series 2',
    //             data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
    //         }
    //     ],
    //     []
    // )

    // axes = React.useMemo(
    //     () => [
    //         { primary: true, type: 'linear', position: 'bottom' },
    //         { type: 'linear', position: 'left' }
    //     ],
    //     []
    // )

    componentDidMount() {
        this.loadModels();
        this.loadArch();
        this.loadDatasets();
    }

    resetDatasetState() {
        this.setState({
            newModelTitle: '',
            newModelArch: this.state.archs[0]._id,
            newModelDataset: this.state.datasets[0].meta._id,
        });
    }

    handleSubmit(event) {
        var title = this.state.newModelTitle;
        var arch = this.state.newModelArch;
        var dataset = this.state.newModelDataset;
        if (title !== '' && arch !== '' && dataset !== '') {
            this.sendNewModel(title, arch, dataset);
        }
    }

    sendNewModel(title, arch, dataset) {
        var url = 'http://169.60.115.39:8888/model';
        var params = {
            "arch_id": arch,
            "dataset_id": dataset,
            "title": title,
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
                    this.toggleModelModal();
                    this.loadModels();
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    trainModel(id) {
        var url = 'http://169.60.115.39:8888/train';
        var params = {
            "model_id": id
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
                    this.loadModels();
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    toggleModelModal() {
        this.resetDatasetState();
        this.setState({ newModelModalShow: !this.state.newModelModalShow });
    }

    toggleModelDetailsModal(model) {
        this.setState(
            {
                detailsModalShow: !this.state.detailsModalShow,
                selectedModel: model
            }
        )
    }

    loadDatasets() {
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
                    if (response.data.length > 0){
                        this.setState({
                            datasets: response.data,
                            loadingDatasets: false,
                            newModelDataset: response.data[0].meta._id,
                        });
                    } else {
                        this.setState({
                            loadingDatasets: false,
                        });
                    }
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    loadModels() {
        var url = 'http://169.60.115.39:8888/models';

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
                        models: response.data
                    });
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    loadArch() {
        var url = 'http://169.60.115.39:8888/arch';

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
                        archs: response.data,
                        loadingArch: false,
                        newModelArch: response.data[0]._id,
                    });
                }
                else {
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    render(){

        if (this.state.loadingArch || this.state.loadingDatasets) {
            return (
                <div>
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }
        else {
            const models = this.state.models.map((model) => {
                
                var id = model._id;
                var title = model.title;
                var state = model.progress.state;
                var created = model.date_created;

                if (state === 'created'){
                    return (
                        <Card style={{ width: '18rem', textAlign: "left" }} className={"col-4 dataset-card"} key={id}>
                            <Card.Body>
                                <Card.Title>{title}</Card.Title>
                                <span onClick={() => this.trainModel(id)}>train</span>
                            </Card.Body>
                        </Card>
                    );
                }
                else {
                    return (
                        <Card style={{ width: '18rem', textAlign: "left" }} className={"col-4 dataset-card"} key={id}>
                            <Card.Body>
                                <Card.Title>{title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{created}</Card.Subtitle>
                                <Card.Text >{state}</Card.Text>
                                <Button variant="primary" onClick={() => {
                                    // this.toggleEditModal(dataset);
                                }}>Use</Button>
                                <Button variant="primary" onClick={() => {
                                    this.toggleModelDetailsModal(model)
                                }}>Info</Button>
                                <Button variant="danger" onClick={() => {
                                    // this.toggleDeleteModal(dataset)
                                }}>Delete</Button>
                            </Card.Body>
                        </Card>
                    );
                }
            });

            const archOptions = this.state.archs.map((arch) => {
                var id = arch._id;
                var title = arch.model_name;
                var type = arch.model_type;
                return (
                    <option key={id} value={id}>
                        {title} ( {type} )
                    </option>
                );
            });

            const datasetOptions = this.state.datasets.map((dataset) => {
                var id = dataset.meta._id;
                var title = dataset.meta.title;
                return (
                    <option key={id} value={id}>
                        {title}
                    </option>
                );
            });

            let detailsModal = null;

            if (this.state.detailsModalShow) {
                detailsModal = <ModelDetails
                    show={true}
                    model={this.state.selectedModel}
                    onHide={() => {
                        this.toggleModelDetailsModal(null);
                    }}
                    token={this.state.token}
                />;
            }

            return (
                <div>
                    <div className={"p-3"}>
                        <div className={"row mt-4"}>
                            <h2 className={"m-3"}>My Models</h2>
                            <ButtonToolbar>
                                <Button variant="primary" onClick={() => this.toggleModelModal()}>
                                    New
                                </Button>
                                {detailsModal}
                                <Modal
                                    show={this.state.newModelModalShow}
                                    onHide={() => this.toggleModelModal()}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                            Create new model
                                    </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group controlId="formGroupTitle">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control required
                                                    type="text"
                                                    placeholder="Title"
                                                    name={'newModelTitle'}
                                                    onChange={this.handleInputChange}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formGroupArch">
                                                <Form.Label>Architecture</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={'newModelArch'}
                                                    onChange={this.handleInputChange}
                                                >
                                                    {archOptions}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="formGroupDatasets">
                                                <Form.Label>Dataset</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={'newModelDataset'}
                                                    onChange={this.handleInputChange}
                                                >
                                                    {datasetOptions}
                                                </Form.Control>
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
                            {models}
                        </div>
                    </div>
                </div>
            );
        }
    }

}

export default ModelsComponent;