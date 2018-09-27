import React, { Component } from 'react';

export class Tabs extends Component {
    constructor(props) {
        super(props);

        this.tabs = [];
        (props.children || []).forEach(tab => {
            if (tab.type === 'tab') {
                this.tabs.push({
                    name: tab.props.name || '',
                    elements: tab.props.children || []
                });
            }
        });
        this.state = {
            visibleTab: this.tabs.length && this.tabs[0].name
        }
    }

    onClick = (e) => {
        this.setState({ visibleTab: e.tab });
        this.render();
    }

    render() {
        return (
            <div className="Tabs">
                <div className='TabButtons' id="tabButtons">
                    {
                        this.tabs.map(tab => {
                            return <button key={tab.name} className={this.state.visibleTab === tab.name ? 'active' : 'notActive'} onClick={this.onClick.bind(this, { tab: tab.name })}>{tab.name}</button>
                        })
                    }
                </div>
                <div className='TabContents'>
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