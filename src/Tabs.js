import React, { Component } from 'react';
import { events } from './EventManager';
import { Button } from 'antd';

export class Tabs extends Component {
    constructor(props) {
        super(props);

        this.tabs = [];

        this.events = events.getInstance();

        this.events.add('setTab', this.setTab.bind(this));

        this.events.add('setTheme', this.setTheme);

        (props.children || []).forEach(tab => {
            if (tab.type === 'tab') {
                this.tabs.push({
                    name: tab.props.name || '',
                    elements: tab.props.children || []
                });
            }
        });
        this.state = {
            visibleTab: this.tabs.length && this.tabs[0].name,
            theme: 'dark TabContentsLightBorder'
        }
    }

    onClick = (e) => {
        this.setState({ visibleTab: e.tab });
    }

    setTab(tabName) {
        this.setState({ visibleTab: tabName[0] });
    }

    setTheme = (theme) => {
        theme=theme[0];
        const currentState = Object.assign({}, this.state);
        currentState.theme = theme + ' ' + (theme === 'dark' ? 'TabContentsLightBorder' : 'TabContentsDarkBorder');
        this.setState(currentState);
    }

    render() {
        return (
            <div className="Tabs">
                <div className='TabButtons' id="tabButtons">
                    {
                        this.tabs.map(tab => {
                            return <Button type={this.state.visibleTab === tab.name ? 'primary' : 'default'} key={tab.name} onClick={this.onClick.bind(this, { tab: tab.name })}>{tab.name}</Button>
                        })
                    }
                </div>
                <div className={`TabContents ${this.state.theme}`}>
                    {
                        this.tabs.map(tab => {
                            return (
                                <div key={tab.name} style={this.state.visibleTab === tab.name ? {} : {display: 'none'}}>
                                    {tab.elements}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}