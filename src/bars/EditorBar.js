import React, { Component } from 'react';

export class EditorBar extends Component {
    constructor(props) {
        super(props);
        
        this.style = {
            height: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'monaco',
            fontSize: '12px'
        };

        this.textDivStyle = {
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }

        this.textStyle = {
            color: '#e5ffff'
        }

        this.locationStyle = {
            color: '#e5ffff'
        }

        this.locationDivStyle = {
            color: '#e5ffff',
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }
    }

    render() {
        return (
            <div style={this.style}>
                <div style={this.textDivStyle}>
                    <span style={this.textStyle}>{this.props.errorText}</span>
                </div>
                <div style={this.locationDivStyle}>
                    <span style={this.locationStyle}>{this.props.errorLocation}</span>
                </div>
            </div>
        );
    }
}