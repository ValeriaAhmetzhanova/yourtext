import React, { Component } from 'react';
import { EditorState } from 'draft-js';

import Editor from 'draft-js-plugins-editor';

import createAutocompletePlugin from '../AutocompletePlugin';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import editorStyles from './styles/editorStyles.module.css';

import buttonStyles from './styles/buttonStyles.module.css';
import toolbarStyles from './styles/toolbarStyles.module.css';
import blockTypeSelectStyles from './styles/blockTypeSelectStyles.module.css';

import mentions from './mentions';
import 'draft-js-side-toolbar-plugin/lib/plugin.css';
import {Form, Modal} from "react-bootstrap";

class MainPageComponent extends Component {

    constructor(props) {
        super(props);

        this.autocompletePlugin = createAutocompletePlugin({
            mentions,
            entityMutability: 'MUTABLE',
            mentionPrefix: '',
            supportWhitespace: true,
        });

        this.sideToolbarPlugin = createSideToolbarPlugin({
            position: 'left',
            theme: { buttonStyles, toolbarStyles, blockTypeSelectStyles }
        });
        this.loadModels = this.loadModels.bind(this);
        this.handleModelSelect = this.handleModelSelect.bind(this);
        this.toggleLoadingModal = this.toggleLoadingModal.bind(this);

        this.getSelectedModel = this.getSelectedModel.bind(this);
    }

    state = {
        editorState: EditorState.createEmpty(),
        suggestions: mentions,
        open: false,
        token: this.props.token,
        models: [],
        modelSelected: 'default',
        loadingModalShow: false
    };

    getSelectedModel() {
        return this.state.modelSelected;
    }

    componentDidMount() {
        if (this.state.token){
            this.loadModels();
        }
    }

    toggleLoadingModal() {
        this.setState({ loadingModalShow: !this.state.loadingModalShow });
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

    onOpenChange = newOpen => {
        this.setState({
            open: newOpen,
        });
    };

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSearchChange = ({ value }) => {

    };

    focus = () => {
        this.editor.focus();
    };

    loadSampler(id){
        var url = 'http://169.60.115.39:8888/samplers/load';

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
                    this.setState({
                        modelSelected: response.sampler_id
                    });
                    this.toggleLoadingModal();
                    alert("Model is successfully loaded");
                }
                // else if (response.text === id + " is already loaded") {
                //     this.setState({
                //         modelSelected: id
                //     });
                //     this.toggleLoadingModal();
                //     alert("Model is successfully loaded");
                //     console.log(this.state.modelSelected);
                // }
                else {
                    this.toggleLoadingModal();
                    alert(response.text);
                }
            })
            .catch(error => console.log(error));
    }

    handleModelSelect(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (value !== "default"){
            this.toggleLoadingModal();
            this.loadSampler(value);
        }
        else {
            this.setState({
                modelSelected: "default"
            });
        }
    }

    render() {
        const { MentionSuggestions } = this.autocompletePlugin;
        const { SideToolbar } = this.sideToolbarPlugin;
        const plugins = [this.autocompletePlugin, this.sideToolbarPlugin];
        let models;
        if (this.state.token){
            models = this.state.models.map((model) => {
                if (model.progress.state === 'complete'){
                    var id = model._id;
                    var title = model.title;
                    return (
                        <option key={id} value={id}>
                            {title}
                        </option>
                    );
                }
            });
            models.unshift(
                <option key={-1} value={'default'}>
                    {"Default"}
                </option>
            )
        }
        if (this.state.token) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12" style={{textAlign: "center"}}>
                            <h2 className="mt-5">Start creating in the area below</h2>
                            <p className="lead">Hit Escape to finish your thoughts</p>
                        </div>
                    </div>

                    <div>
                        <Form>
                            <Form.Group controlId="formGroupArch">
                                <Form.Label>Model</Form.Label>
                                <Form.Control
                                    as="select"
                                    name={'modelSelected'}
                                    onChange={this.handleModelSelect}
                                >
                                    {models}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>

                    <Modal
                        show={this.state.loadingModalShow}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Body>
                            <h4>The model is loading, please wait...</h4>
                        </Modal.Body>
                    </Modal>

                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className={editorStyles.editor} onClick={this.focus}>
                                <Editor
                                    editorState={this.state.editorState}
                                    onChange={this.onChange}
                                    plugins={plugins}
                                    ref={(element) => { this.editor = element; }}
                                />
                                <MentionSuggestions
                                    open={this.state.open}
                                    token={this.state.token}
                                    onOpenChange={this.onOpenChange}
                                    onSearchChange={this.onSearchChange}
                                    suggestions={this.state.suggestions}
                                    getModel={this.getSelectedModel}
                                />
                                <SideToolbar />
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
        else {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12" style={{textAlign: "center"}}>
                            <h2 className="mt-5">Start creating in the area below</h2>
                            <p className="lead">Hit Escape to finish your thoughts</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className={editorStyles.editor} onClick={this.focus}>
                                <Editor
                                    editorState={this.state.editorState}
                                    onChange={this.onChange}
                                    plugins={plugins}
                                    ref={(element) => { this.editor = element; }}
                                />
                                <MentionSuggestions
                                    open={this.state.open}
                                    token={this.state.token}
                                    onOpenChange={this.onOpenChange}
                                    onSearchChange={this.onSearchChange}
                                    suggestions={this.state.suggestions}
                                    getModel={this.getSelectedModel}
                                />
                                <SideToolbar />
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
    }
}

export default MainPageComponent;