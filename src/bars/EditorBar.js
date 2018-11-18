import React, { Component } from 'react';
import { events } from '../EventManager';

export class EditorBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setTheme', this.setTheme);

        this.state = {
            theme: 'lightText'
        }
    }

    setTheme = (theme) => {
        theme = theme[0];
        this.setState({
            theme: (theme === 'dark' ? 'lightText' : 'darkText')
        });
    }

    render() {
        return (
            <div className={`EditorBar ${this.state.theme}`}>
                <div className="TextDiv">
                    <span>{this.props.errorText}</span>
                </div>
                <div className="LocationDiv">
                    <span>{this.props.errorLocation}</span>
                </div>
            </div>
        );
    }
}