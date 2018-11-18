import React, { Component } from 'react';
import { events } from '../../EventManager';
import { edit, config } from 'ace-builds';

export class AceEditor extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();
        this.events.add('setCode', this.setCode);

        this.events.add('setTheme', this.setTheme);

        this.editor = undefined;
        this.panelCallback = props.panelCallback;
    }

    setTheme = (theme) => {
        theme = theme[0];
        if (this.editor) {
            if (theme === 'dark') {
                this.editor.setTheme('ace/theme/tomorrow_night');
            } else {
                this.editor.setTheme('ace/theme/tomorrow');
            }
        }
    }

    setCode = (code) => {
        code = code[0];
        if (this.editor) {
            this.editor.getSession().setValue(code);
        }
    }

    componentDidMount() {
        this.editor = edit('ace-container');
        config.set('basePath', '/VisualStructures/lib/ace/');
        this.editor.setTheme('ace/theme/tomorrow_night');
        this.editor.getSession().setUseWorker(false);
        this.editor.getSession().setTabSize(4);
        this.editor.setOptions({
            fontFamily: 'monaco, monospace',
            showPrintMargin: false
        });
        this.editor.getSession().on('change', (e) => {
            this.panelCallback(this.editor.getSession().getValue());
        });
        this.loadText();
    }

    loadText() {
        const currentText = window.localStorage.getItem('code');
        if (currentText) {
            this.setCode([currentText]);
        }
    }

    render() {
        return (
            <div id='ace-container' className="Ace"></div>
        );
    }
}