import React, { Component } from 'react';
import logo from '../images/logo.svg';

export class Header extends Component {
    render() {
        return (
            <div className='header'>
                <img src={logo} alt=''></img>
            </div>
        );
    }
}