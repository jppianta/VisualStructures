import React, { Component } from 'react';
import { events } from '../../EventManager';
import { History } from '../../History';
import { Humanizer } from './Humanizer';

export class HistoryBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('updateHistory', this.updateHistory.bind(this));

        this.history = new History();

        this.humanizer = new Humanizer();

        this.state = {
            items: [],
            functionName: '',
            stepName: ''
        }
    }

    updateItems(actionList) {
        return (actionList || []).map((step, idx) => {
            return (
                <div key={idx} className={this.history.currentStep === idx ? 'Active' : 'HistoryItem'} onClick={this.onStepClick.bind(this, idx, step)}>

                </div>
            );
        });
    }

    onStepClick(idx, step) {
        this.history.jumpToStep(idx);
        this.setState({
            functionName: this.history.actionList[idx].functionName,
            stepName: this.humanizer.humanizeStep(step.operation)
        });
        this.updateHistory();
    }

    updateHistory(actionList) {
        if (actionList) {
            this.history.setStepList(actionList[0]);
            const items = this.updateItems(this.history.actionList);
            this.setState({
                functionName: this.history.actionList[0] ? this.history.actionList[0].functionName : '',
                stepName: this.history.actionList[0] ? this.humanizer.humanizeStep(this.history.actionList[0].operation) : '',
                items
            });
        } else {
            const items = this.updateItems(this.history.actionList);
            this.setState({
                items
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
                <div className="HistorySteps">
                    {this.state.items}
                </div>
            </div>
        );
    }
}