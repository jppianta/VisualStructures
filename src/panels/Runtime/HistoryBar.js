import React, { Component } from 'react';

export class HistoryBar extends Component {
    render() {
        return (
            <div className="HistoryBar">
                <div className="Step">
                    <span className="Function">{this.props.info.functionName}</span>
                    <span className="Operation">{this.props.info.stepName}</span>
                </div>
                <div className="HistorySteps">
                    {this.props.info.items}
                </div>
            </div>
        );
    }
}