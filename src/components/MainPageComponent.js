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
    }

    state = {
        editorState: EditorState.createEmpty(),
        suggestions: mentions,
        open: false
    };

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

    render() {
        const { MentionSuggestions } = this.autocompletePlugin;
        const { SideToolbar } = this.sideToolbarPlugin;
        // const plugins = [];
        const plugins = [this.autocompletePlugin, this.sideToolbarPlugin];

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
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
                                onOpenChange={this.onOpenChange}
                                onSearchChange={this.onSearchChange}
                                suggestions={this.state.suggestions}
                            />
                            <SideToolbar />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default MainPageComponent;