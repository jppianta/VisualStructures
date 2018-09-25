import React, { Component } from 'react';
import { events } from '../../EventManager';
import { edit, config } from 'ace-builds';

export class AceEditor extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.editor = undefined;
        this.text = '';
        this.panelCallback = props.panelCallback;
    }

    componentDidMount() {
        this.editor = edit('ace-container');
        config.set('basePath', '/VisualStructures/lib/ace/');
        this.editor.setTheme('ace/theme/tomorrow_night');
        this.editor.getSession().setTabSize(4);
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
            <div id='ace-container' className="Ace"></div>
        );
    }
}