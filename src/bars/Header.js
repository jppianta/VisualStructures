import React, { Component } from 'react';
import logo from '../images/logo.svg';

export class Header extends Component {
    constructor(props) {
        super(props);
        
        this.imgStyle = {
            height: '8%',
            maxHeight: '80px',
            marginTop: '15px'
        };
    }

    render() {
        return (
            <div className='header' style={this.style}>
                <img src={logo} alt='' style={this.imgStyle}></img>
            </div>
        );
    }
}