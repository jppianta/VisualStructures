import React, { Component } from 'react';
import { events } from '../EventManager';

export class VisualizerBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.style = {
            height: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        this.state = {
            value: 'None'
        }

        this.executeFunction = props.executeFunction;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    runFunction = () => {
        if (this.state.value !== 'None') {
            this.executeFunction(this.state.value);
            this.events.dispatch('setTab', 'Runtime');
        }
    }

    render() {
        return (
            <div className="VisualizerBar">
                <select className="Select" value={this.state.value} onChange={this.handleChange}>
                    {this.props.items}
                </select>
                <button className="RunButton" onClick={this.runFunction.bind(this)}>Run</button>
            </div>
        );
    }
}