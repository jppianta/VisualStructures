import React, { Component } from 'react';
import newLogo from '../images/newLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import { events } from '../EventManager';
import { Switch } from 'antd';

export class Header extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setTheme', this.setLogo);

        this.state = {
            logo: newLogo
        }
    }

    setLogo = (theme) => {
        theme = theme[0];
        this.setState({
            logo: theme === 'dark' ? newLogo : darkLogo
        });
    }

    changeMode = (checked) => {
        const theme = checked ? 'light' : 'dark';
        this.events.dispatch('setTheme', theme);
    }

    render() {
        return (
            <div className='header'>
                <img src={this.state.logo} alt=''></img>
                <Switch checkedChildren="Light" unCheckedChildren="Dark" onChange={this.changeMode} />
            </div>
        );
    }
}