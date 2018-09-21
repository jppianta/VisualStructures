import React, { Component } from 'react';

export class EditorBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="EditorBar">
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