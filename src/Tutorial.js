import React, { Component } from 'react';
import { events } from './EventManager';
import { Button, Modal } from 'antd';

export const renderTutorial = (that) => {
    const currentState = Object.assign({}, that.state);
    currentState.tutorialActive = 'tutorialActive';
    that.setState(currentState);
}

export const destroyTutorial = (that) => {
    const currentState = Object.assign({}, that.state);
    currentState.tutorialActive = '';
    that.setState(currentState);
}

export class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.events = events.getInstance();

    this.currentStep = 0;

    this.state = {
        contents: [
            <p>Hi</p>,
            <p>Hi 2</p>
        ],
        showingContent: <p>Hi</p>,
        visible: this.props.visible
    }
  }

  nextStep = () => {
    if (this.currentStep + 1 < this.state.contents.length) {
        this.currentStep++;
        const currentState = Object.assign({}, this.state);
        currentState.showingContent = this.state.contents[this.currentStep];
        this.events.dispatch('closeActive');
        this.events.dispatch(`step${this.currentStep}`, null);
        this.setState(currentState);
    }
  }

  previousStep = () => {
    if (this.currentStep - 1 >= 0) {
        this.currentStep--;
        const currentState = Object.assign({}, this.state);
        currentState.showingContent = this.state.contents[this.currentStep];
        this.events.dispatch('closeActive');
        this.events.dispatch(`step${this.currentStep}`, null);
        this.setState(currentState);
    }
  }

  onCancel = () => {
    const currentState = Object.assign({}, this.state);
    currentState.visible = false;
    this.setState(currentState);
    this.events.dispatch('closeActive');
  }

  render() {
    return (
        <Modal
            title="Tutorial"
            visible={this.state.visible}
            onOk={this.nextStep}
            okText='Next'
            onCancel={this.onCancel}
            cancelButtonProps={{
                onClick: this.previousStep
            }}
            cancelText='Previous'
            maskStyle={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
            maskClosable={false}
        >
           {
               this.state.showingContent
           }
        </Modal>
    );
  }
}