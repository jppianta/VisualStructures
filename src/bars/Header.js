import React, { Component } from 'react';
import newLogo from '../images/newLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import { events } from '../EventManager';
import { Switch, Button } from 'antd';
import { Tutorial } from '../Tutorial';

export class Header extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setTheme', this.setLogo);

        this.state = {
            logo: newLogo,
            tutorialEnabled: false
        }
    }

    setLogo = (theme) => {
        theme = theme[0];
        this.setState({
            logo: theme === 'dark' ? newLogo : darkLogo,
            tutorialEnabled: this.state.tutorialEnabled
        });
    }

    changeMode = (checked) => {
        const theme = checked ? 'light' : 'dark';
        this.events.dispatch('setTheme', theme);
    }

    openTurorial = () => {
        this.setState({
            logo: this.state.logo,
            tutorialEnabled: true
        });
    }

    render() {
        return (
            <div className='header'>
                <Button type="primary" onClick={this.openTurorial}>Open Tutorial</Button>
                <img src={this.state.logo} alt=''></img>
                <Switch checkedChildren="Light" unCheckedChildren="Dark" onChange={this.changeMode} />
                <Tutorial enabled={this.state.tutorialEnabled}/>
            </div>
        );
    }
}