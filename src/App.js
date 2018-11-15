import React, { Component } from 'react';
import './styles/css/index.css';
import { MainPanel } from './panels/MainPanel';
import { Header } from './bars/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <MainPanel />
      </div>
    );
  }
}

export default App;
