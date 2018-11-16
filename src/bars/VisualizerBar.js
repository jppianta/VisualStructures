import React, { Component } from 'react';
import { events } from '../EventManager';
import { Button, Dropdown, Icon, Menu } from 'antd';

export class VisualizerBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.style = {
            height: '10%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        this.state = {
            selected: null
        }

        this.executeFunction = props.executeFunction;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = ({ key }) => {
        this.setState({
            selected: key
        });
    }

    runFunction = () => {
        if (this.state.selected) {
            this.executeFunction(this.state.selected);
            this.events.dispatch('setTab', 'Runtime');
        }
    }

    createMenu = (items) => {
        return (
            <Menu onClick={this.handleChange}>
                {
                    items.map(item => {
                        return <Menu.Item key={item}>
                            <a>
                                {item}
                            </a>
                        </Menu.Item>
                    })
                }
            </Menu>
        );
    }

    render() {
        return (
            <div className="VisualizerBar">
                {
                    this.props.items.length > 0 ?
                        <Dropdown overlay={this.createMenu(this.props.items)} trigger={['click']}>
                            {
                                this.state.selected ?
                                    <a className="ant-dropdown-link" href="#">
                                        {this.state.selected} <Icon type="down" />
                                    </a> :
                                    <a className="ant-dropdown-link" href="#">
                                        Functions <Icon type="down" />
                                    </a>
                            }
                        </Dropdown> :
                        <a className="ant-dropdown-link" href="#">
                            Functions
                        </a>
                }
                <Button type="primary" onClick={this.runFunction}>Run</Button>
            </div>
        );
    }
}