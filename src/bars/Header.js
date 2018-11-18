import React, { Component } from 'react';
import newLogo from '../images/newLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import { events } from '../EventManager';
import { Tutorial, destroyTutorial, renderTutorial } from '../Tutorial';
import { Switch } from 'antd';

export class Header extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setTheme', this.setLogo);

        this.events.add('step0', renderTutorial.bind(this, this));

        this.events.add('closeActive', destroyTutorial.bind(this, this));

        this.state = {
            logo: newLogo,
            tutorialActive: ''
        }
    }

    setLogo = (theme) => {
        theme = theme[0];
        const currentState = Object.assign({}, this.state);
        currentState.theme = theme === 'dark' ? newLogo : darkLogo
        this.setState(currentState);
    }

    changeMode = (checked) => {
        const theme = checked ? 'light' : 'dark';
        this.events.dispatch('setTheme', theme);
    }

    render() {
        return (
            <div className='header'>
                <img src={this.state.logo} alt=''></img>
                <Tutorial />
                <Switch className={this.state.tutorialActive} checkedChildren="Light" unCheckedChildren="Dark" onChange={this.changeMode} />
            </div>
        );
    }
}