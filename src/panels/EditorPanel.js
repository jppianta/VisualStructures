import React, { Component } from 'react';
import { events } from '../EventManager';
import { parse } from '../grammar/grammar';
import { AceEditor } from '../outsiders/ace/Ace';
import { EditorBar } from '../bars/EditorBar';

export class EditorPanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();
        this.events.add('textChanged', this.textChanged);
        this.text = '';
        this.error = undefined;
        this.style = {
            flex: 1,
            flexDirection: 'column'
        }
        this.state = {
            error: ''
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
            this.error = err.message;
        } finally {
            this.setErrorMessage();
        }
    }

    setErrorMessage() {
        this.setState(state => ({
            error: this.error
        }));
    }

    render() {
        return (
            <div style = {this.style}>
                <AceEditor 
                    panelCallback = {this.textChanged.bind(this)}   
                />
                <EditorBar 
                    errorText = {this.state.error}
                />
            </div>
        );
}
}