import React, { Component } from 'react';
import { Visualizer } from '../outsiders/visjs/Visualizer';
import { VisualizerBar } from '../bars/VisualizerBar';

export class VisualizerPanel extends Component {
    render() {
        return (
            <div className="VisualizerPanel">
                <div className="container">
                    <div className="filler"></div>
                    <Visualizer />
                </div>
                <VisualizerBar items={this.props.items} executeFunction={this.props.executeFunction}/>
            </div>
        );
    }
}