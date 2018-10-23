import React, { Component } from 'react';
import { HistoryBar } from './HistoryBar';

export class RuntimePanel extends Component {
    render() {
        return (
            <div className="HistoryPanel">
                <HistoryBar />
            </div>
        );
    }
}