import React, { Component } from 'react';
import { EditorPanel } from './EditorPanel';
import { VisualizerPanel } from './VisualizerPanel';
import { Interpreter } from '../Interpreter';

export class MainPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        }

        this.interpreter = new Interpreter();
    }

    updateCode = (code) => {
        this.updateItems(code.functions);
        this.interpreter.setCode(code);
    }

    updateItems(items) {
        const newItems = items.map(item => {
            return item.name
        }); 
        this.setState({
            items: newItems
        });
    }

    executeFunction = (functionName) => {
        if (this.interpreter.hasCode()) {
            this.interpreter.executeFunction(functionName, [], true);
        }
    }

    render() {
        return (
            <div className="MainPanel">
                <EditorPanel updateCode={this.updateCode.bind(this)}/>
                <VisualizerPanel items={this.state.items} executeFunction={this.executeFunction.bind(this)}/>
            </div>
        );
    }
}