import React, { Component } from 'react';
import { Visualizer } from '../outsiders/visjs/Visualizer';
import { VisualizerBar } from '../bars/VisualizerBar';

export class VisualizerPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="VisualizerPanel">
                <Visualizer />
                <VisualizerBar items={this.props.items} executeFunction={this.props.executeFunction}/>
            </div>
        );
    }
}