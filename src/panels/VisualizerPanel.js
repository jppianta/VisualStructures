import React, { Component } from 'react';
import { Visualizer } from '../outsiders/visjs/Visualizer';
import { VisualizerBar } from '../bars/VisualizerBar';

export class VisualizerPanel extends Component {

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        const tabEl = document.getElementById('tabButtons');
        const tabSize = tabEl.getClientRects()[0];
        const fillerEl = document.getElementById('filler');
        fillerEl.style.height = tabSize.height + 'px';
    }

    render() {
        return (
            <div className="VisualizerPanel">
                <div className="container">
                    <div id="filler"></div>
                    <Visualizer />
                </div>
                <VisualizerBar items={this.props.items} executeFunction={this.props.executeFunction} />
            </div>
        );
    }
}