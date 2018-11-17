import React, { Component } from 'react';
import { Menu, Popconfirm, message } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { events } from '../../EventManager.js';

const examples = require('./Examples/examples.json')

export class ExamplesPanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setTheme', this.setTheme);

        this.menuTheme = 'dark'

        this.state = {
            menu: this.parseExaples()
        }
    }

    setTheme = (theme) => {
        theme = theme[0];
        this.menuTheme = theme;
        this.setState({ menu: this.parseExaples() })
    }

    onClick = ({ key }) => {
        const path = key.split('/');
        const text = path.reduce((current, key) => current[key], examples);
        this.events.dispatch('setCode', text);
        this.events.dispatch('setTab', 'Code');
    }

    confirm = (key) => {
        const path = key.split('/');
        const text = path.reduce((current, key) => current[key], examples);
        this.events.dispatch('setCode', text);
        this.events.dispatch('setTab', 'Code');
        message.success(`${path[path.length - 1]} loaded`);
    }

    parseExaples() {
        const types = Object.keys(examples);
        return (
            <Menu mode='inline' theme={this.menuTheme}>
                {
                    types.map(key => {
                        return (
                            <SubMenu key={key} title={key}>
                                {
                                    Object.keys(examples[key]).map(subKey => {
                                        return (
                                            <Menu.Item key={key + '/' + subKey}>
                                                <Popconfirm title="Are you sure you want to overwrite the editor?" onConfirm={this.confirm.bind(this, key + '/' + subKey)} okText="Yes" cancelText="No">
                                                    <a href="#">{subKey}</a>
                                                </Popconfirm>
                                            </Menu.Item>
                                        );
                                    })
                                }
                            </SubMenu>
                        );
                    })
                }
            </Menu>
        );
    }

    render() {
        return this.state.menu;
    }
}