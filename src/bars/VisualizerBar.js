import React, { Component } from 'react';

export class VisualizerBar extends Component {
    constructor(props) {
        super(props);

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
            this.executeFunction(this.state.value, true);
        }
    }

    render() {
        return (
            <div style={this.style}>
                <select value={this.state.value} onChange={this.handleChange}>
                    {this.props.items}
                </select>
                <button onClick={this.runFunction.bind(this)}>Run</button>
            </div>
        );
    }
}