import React, { Component } from 'react';
import './styles/css/index.css';
import { MainPanel } from './panels/MainPanel';
import { Header } from './bars/Header';
import { events } from './EventManager';

class App extends Component {
  constructor(props) {
    super(props);

    this.events = events.getInstance();

    this.events.add('setTheme', this.setTheme);

    this.state = {
      theme: 'dark'
    }
  }

  setTheme = (theme) => {
    theme=theme[0];
    const currentState = Object.assign({}, this.state);
    currentState.theme = theme;
    this.setState(currentState);
}

  render() {
    return (
      <div className={`App ${this.state.theme}`}>
        <Header />
        <MainPanel />
      </div>
    );
  }
}

export default App;
