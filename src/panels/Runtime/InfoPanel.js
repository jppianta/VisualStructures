import React, { Component } from 'react';
import { stepHistory } from '../../History';
import { events } from '../../EventManager';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';

export class InfoPanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('nodeClicked', this.onNodeClick);

        this.info = {};


        this.state = {
            menu: null
        }
    }

    createStructure(info, initial) {
        return this.copy(info, initial)
    }

    copy(obj, initial) {
        const res = {};
        Object.keys(obj).forEach(key => {
            let val;
            if (initial) {
                val = obj[key].value;
            } else {
                val = obj[key];
            }
            if (val && val instanceof Object) {
                res[key] = () => { return this.copy(val, initial); };
            } else {
                res[key] = val;
            }
        });
        return res;
    }

    createMenu(info) {
        let initial = false;
        if (info) {
            initial = true;
            this.info = this.createStructure(info, initial);
        }
        return (
            <Menu theme='dark' mode='inline'>
                {
                    Object.keys(this.info).map(key => {
                        if (typeof this.info[key] === 'function' || this.info[key] instanceof Object) {
                            return this.createSubMenu(key, this.info[key]);
                        } else {
                            const val = `${key}: ${this.info[key]}`
                            return <Menu.Item key={val}>{val}</Menu.Item>
                        }
                    })
                }
            </Menu>
        );
    }

    handleClick = (key) => {
        key = key.split('/');
        const last = key[key.length - 1];
        key = key.slice(0, -1);
        const node = key.reduce((current, name) => current && current[name], this.info);
        if (typeof node[last] === 'function') {
            node[last] = node[last]();
            this.setState({
                menu: this.createMenu()
            })
        }
    }

    createSubMenu(name, info) {
        const path = name.split('/');
        const title = path[path.length - 1];
        return (
            typeof info === 'function' ? 
            <SubMenu key={name} title={title} onTitleClick={this.handleClick.bind(this, name)} /> :
            <SubMenu key={name} title={title} >
                {
                    Object.keys(info).map(key => {
                        if (typeof info[key] === 'function' || info[key] instanceof Object) {
                            return this.createSubMenu(`${name}/${key}`, info[key]);
                        } else {
                            const val = `${key}: ${info[key]}`
                            return <Menu.Item key={val}>{val}</Menu.Item>
                        }
                    })
                }
            </SubMenu>
        );
    }

    onNodeClick = (nodeIndex) => {
        nodeIndex = nodeIndex[0];

        const step = stepHistory.actionList[stepHistory.currentStep];

        const node = step.nodes[nodeIndex];

        if (node) {
            const info = node.prop;

            this.setState({
                menu: this.createMenu(info)
            });
        }
    }

    render() {
        return (
            this.state.menu ?
            <div className="InfoPanel">
                <h2>Node Info</h2>
                <div style={{overflowY: 'auto'}}>
                    {
                        this.state.menu
                    }
                </div>
            </div> :
            null
        );
    }
}