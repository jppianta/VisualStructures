import React, { Component } from 'react';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { events } from '../../EventManager.js';

const examples = require('./Examples/examples.json')

export class ExamplesPanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();
    }

    onClick = ({key}) => {
        const path = key.split('/');
        const text = path.reduce((current, key) => current[key], examples);
        this.events.dispatch('setCode', text);
        this.events.dispatch('setTab', 'Code');
    }

    parseExaples() {
        const types = Object.keys(examples);
        return (
            <Menu mode='inline' onClick={this.onClick}>
                {
                    types.map(key => {
                        return (
                            <SubMenu key={key} title={key}>
                                {
                                    Object.keys(examples[key]).map(subKey => {
                                        return <Menu.Item key={key+'/'+subKey}>{subKey}</Menu.Item>
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
        return this.parseExaples();
    }
}