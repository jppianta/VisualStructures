import React, { Component } from 'react';
import { events } from '../EventManager';
import { parse } from '../grammar/grammar';
import { AceEditor } from '../outsiders/ace/Ace';
import { EditorBar } from '../bars/EditorBar';
import { Tabs } from '../Tabs';

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
        } catch (err) {
            this.parseErrorMessage(err);
        } finally {
            this.setErrorMessage();
        }
    }

    parseErrorMessage(error) {
        this.error = error.name + ': ' + error.message;
        this.errorLocation = `Line ${error.location.start.line}, Column ${error.location.start.column}`;
        this.setErrorMessage();
    }

    setErrorMessage() {
        this.setState(state => ({
            error: this.error,
            errorLocation: this.errorLocation
        }));
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
                        <div></div>
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