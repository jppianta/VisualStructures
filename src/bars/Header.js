import React, { Component } from 'react';
import newLogo from '../images/newLogo.svg';

export class Header extends Component {
    render() {
        return (
            <div className='header'>
                <img src={newLogo} alt=''></img>
            </div>
        );
    }
}