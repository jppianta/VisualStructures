import React, { Component } from 'react';
import { HistoryBar } from './HistoryBar';

export class RuntimePanel extends Component {
    render() {
        return (
            <div className="RuntimePanel">
                <HistoryBar />
            </div>
        );
    }
}