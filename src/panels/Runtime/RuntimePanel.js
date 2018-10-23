import React, { Component } from 'react';
import { HistoryBar } from './HistoryBar';
import { NodeInfoBar } from './NodeInfoBar';
import { events } from '../../EventManager';
import { Humanizer } from './Humanizer';
import { History } from '../../History';

export class RuntimePanel extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('updateHistory', this.updateHistory.bind(this));

        this.history = new History();

        this.humanizer = new Humanizer();

        this.state = {
            historyBar: {
                items: [],
                functionName: '',
                stepName: ''
            }
        }
    }

    updateHistory(actionList) {
        if (actionList) {
            this.history.setStepList(actionList[0]);
            const items = this.updateItems(this.history.actionList);
            const newHistoryBar = Object.assign({}, this.state.historyBar, {
                functionName: this.history.actionList[0] ? this.history.actionList[0].functionName : '',
                stepName: this.history.actionList[0] ? this.humanizer.humanizeStep(this.history.actionList[0].operation) : '',
                items
            });
            this.setState({
                historyBar: newHistoryBar
            });
        } else {
            const items = this.updateItems(this.history.actionList);
            const newHistoryBar = Object.assign({}, this.state.historyBar, {
                items
            });
            this.setState({
                historyBar: newHistoryBar
            });
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
        const newHistoryBar = Object.assign({}, this.state.historyBar, {
            functionName: this.history.actionList[idx].functionName,
            stepName: this.humanizer.humanizeStep(step.operation)
        });
        this.setState({
            historyBar: newHistoryBar
        });
        this.updateHistory();
    }

    render() {
        return (
            <div className="HistoryPanel">
                <HistoryBar info={this.state.historyBar}/>
                <NodeInfoBar />
            </div>
        );
    }
}