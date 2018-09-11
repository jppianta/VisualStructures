import React, { Component } from 'react';
import { Visualizer } from '../outsiders/visjs/Visualizer';
import { VisualizerBar } from '../bars/VisualizerBar';

export class VisualizerPanel extends Component {
    constructor(props) {
        super(props);

        this.style = {
            flex: 1,
            flexDirection: 'column'
        }
    }

    render() {
        return (
            <div style={this.style}>
                <Visualizer />
                <VisualizerBar items={this.props.items} executeFunction={this.props.executeFunction}/>
            </div>
        );
    }
}