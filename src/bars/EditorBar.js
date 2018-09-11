import React, { Component } from 'react';

export class EditorBar extends Component {
    constructor(props) {
        super(props);
        
        this.style = {
            height: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        this.textStyle = {
            color: '#e5ffff',
            fontFamily: 'monaco'
        }
    }

    render() {
        return (
            <div style={this.style}>
                <span style={this.textStyle}>{this.props.errorText}</span>
            </div>
        );
    }
}