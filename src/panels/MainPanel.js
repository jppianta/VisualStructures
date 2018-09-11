import React, { Component } from 'react';
import { EditorPanel } from './EditorPanel';
import { VisualizerPanel } from './VisualizerPanel';
import { Interpreter } from '../Interpreter';

export class MainPanel extends Component {
    constructor(props) {
        super(props);

        this.style = {
            display: 'flex',
            height: '100%',
            marginTop: '15px',
            marginLeft: '15px',
            marginRight: '15px'
        };

        this.state = {
            items: [
                <option key='None' value='None'>None</option>
            ]
        }

        this.interpreter = new Interpreter();
    }

    defaultItems() {
        return [
            <option key='None' value='None'>None</option>
        ]
    }

    updateCode = (code) => {
        this.updateItems(code.functions);
        this.interpreter.setCode(code);
    }

    updateItems(items) {
        const newItems = items.map(item => {
            return <option key={item.name} value={item.name}>{item.name}</option>
        }); 
        this.setState({
            items: this.defaultItems().concat(newItems)
        });
    }

    executeFunction = (functionName) => {
        if (this.interpreter.hasCode()) {
            this.interpreter.executeFunction(functionName);
        }
    }

    render() {
        return (
            <div style={this.style}>
                <EditorPanel updateCode={this.updateCode.bind(this)}/>
                <VisualizerPanel items={this.state.items} executeFunction={this.executeFunction.bind(this)}/>
            </div>
        );
    }
}