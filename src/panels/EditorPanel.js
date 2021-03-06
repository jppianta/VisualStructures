import React, { Component } from 'react';
import { events } from '../EventManager';
import { parse } from '../grammar/grammar';
import { AceEditor } from '../outsiders/ace/Ace';
import { EditorBar } from '../bars/EditorBar';
import { Tabs } from '../Tabs';
import { DocumentationPanel } from './DocumentationPanel';
import { RuntimePanel } from './Runtime/RuntimePanel';
import { ExamplesPanel } from './ExamplesTab/ExamplesPanel';

export class EditorPanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();
        this.events.add('textChanged', this.textChanged);
        this.text = '';
        this.error = undefined;
        this.errorLocation = undefined;

        this.state = {
            error: '',
            errorLocation: ''
        };
        this.updateCode = props.updateCode;
    }

    textChanged = (text) => {
        this.text = text;
        this.parseText();
    }

    parseText() {
        try {
            const parsed = parse(this.text);
            this.updateCode(parsed);
            this.error = 'Compiled!';
            this.errorLocation = null;
        } catch (err) {
            this.parseErrorMessage(err);
        } finally {
            this.setErrorMessage();
        }
    }

    parseErrorMessage(error) {
        this.error = error.name + ': ' + error.message;
        this.errorLocation = error.location && `Line ${error.location.start.line}, Column ${error.location.start.column}`;
        this.setErrorMessage();
    }

    setErrorMessage() {
        this.setState({
            error: this.error,
            errorLocation: this.errorLocation
        });
    }

    render() {
        return (
            <div className="EditorPanel">
                <Tabs>
                    <tab name='Code'>
                        <AceEditor 
                            panelCallback = {this.textChanged.bind(this)}  
                        />
                    </tab>
                    <tab name='Runtime'>
                        <RuntimePanel />
                    </tab>
                    <tab name='Documentation'>
                        <DocumentationPanel />
                    </tab>
                    <tab name='Examples'>
                        <ExamplesPanel />
                    </tab>
                </Tabs>
                <EditorBar 
                    errorText = {this.state.error}
                    errorLocation = {this.state.errorLocation}
                />
            </div>
        );
}
}