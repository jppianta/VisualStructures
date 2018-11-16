import React, { Component } from 'react';
import { events } from '../../EventManager';
import { History } from '../../History';
import { Humanizer } from './Humanizer';
import { Pagination } from 'antd';

export class HistoryBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('updateHistory', this.updateHistory.bind(this));

        this.history = new History();

        this.humanizer = new Humanizer();

        this.state = {
            numberOfItems: 0,
            functionName: '',
            stepName: ''
        }
    }

    onChange = (idx) => {
        idx = idx - 1;
        this.history.jumpToStep(idx);
        const step = this.history.actionList[idx]
        this.setState({
            functionName: step.functionName,
            stepName: this.humanizer.humanizeStep(step.operation),
            numberOfItems: this.state.numberOfItems
        });
        this.updateHistory();
    }

    updateHistory(actionList) {
        if (actionList) {
            actionList = actionList[0]
            this.history.setStepList(actionList);
            this.setState({
                functionName: actionList[0] ?actionList[0].functionName : '',
                stepName: actionList[0] ? this.humanizer.humanizeStep(actionList[0].operation) : '',
                numberOfItems: actionList.length
            });
        }
    }

    render() {
        return (
            <div className="HistoryBar">
                <div className="Step">
                    <span className="Function">{this.state.functionName}</span>
                    <span className="Operation">{this.state.stepName}</span>
                </div>
                {
                    this.state.numberOfItems > 0 ? <Pagination total={this.state.numberOfItems * 10} onChange={this.onChange} /> : null
                }
            </div>
        );
    }
}