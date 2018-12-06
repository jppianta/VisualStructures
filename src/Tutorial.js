import React, { Component } from 'react';
import { Steps } from 'intro.js-react';

export class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.steps = [
            {
              element: '.step1',
              intro: 'test 1',
              position: 'right'
            }
          ];
    }

    render() {
        return (
            <Steps
                enabled={this.props.enabled}
                steps={this.steps}
                initialStep={0}
            />
        );
    }
}