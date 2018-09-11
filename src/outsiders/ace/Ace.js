import React, { Component } from 'react';
import { events } from '../../EventManager';
import { edit, config } from 'ace-builds';

export class AceEditor extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.style = {
            height: '90%',
            borderRadius: '5px'
        }
        this.editor = undefined;
        this.text = '';
        this.panelCallback = props.panelCallback;
    }

    componentDidMount() {
        config.set('basePath', '../');
        this.editor = edit('ace-container');
        this.editor.setTheme('ace/theme/tomorrow_night');
        this.editor.getSession().setUseWorker(false);
        this.editor.setOptions({
            fontFamily: 'monaco',
            showPrintMargin: false
        });
        this.editor.getSession().setMode('ace/mode/javascript');
        this.editor.getSession().on('change', (e) => {
            this.panelCallback(this.editor.getSession().getValue());
        });
    }

    render() {
        return (
            <div id='ace-container' style={this.style}></div>
        );
    }
}