import React, { Component } from 'react';
import { HistoryBar } from './HistoryBar';
import { InfoPanel } from './InfoPanel';

export class RuntimePanel extends Component {
    render() {
        return (
            <div className="RuntimePanel">
                <HistoryBar />
                <InfoPanel />
            </div>
        );
    }
}