import React, { Component } from 'react';
import { events } from '../../EventManager';
import { Network } from 'vis';

export class Visualizer extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('newStep', this.updateNetwork.bind(this));

        this.events.add('setTheme', this.setBG);

        this.visualizer = undefined;

        this.background = '#1f2125';

        this.network = null;

        this.nodes = [];

        this.state = {
            theme: 'VisualizerLightBorder'
        }

        this.nodeColors = {
            color: {
                background: '#e5ffff',
                border: '#80cbc4'
            }
        }
    }

    setBG = (theme) => {
        theme = theme[0];
        if (this.network) {
            if (theme === 'dark') {
                this.background = '#1f2125';
                this.setState({ theme: 'VisualizerLightBorder' });
            } else {
                this.background = 'white';
                this.setState({ theme: 'VisualizerDarkBorder' });
            }
            this.network.style.backgroundColor = this.background;
        }
    }

    componentDidMount() {
        const container = document.getElementById('vis-container');
        const options = {
            physics: false,
            autoResize: true,
            width: '',
            height: '',
            layout: {
                hierarchical: {
                    direction: 'UD'
                }
            }
        }
        this.visualizer = new Network(container, {}, options);
        this.visualizer.on('click', (properties) => {
            this.events.dispatch('nodeClicked', properties.nodes[0]);
        });
        this.network = container.firstElementChild;
        this.network.style.backgroundColor = this.background;
        const canvas = this.network.firstElementChild;
        canvas.height = '';
        canvas.width = '';
    }

    async updateNetwork(step) {
        step = step[0];
        const newStep = JSON.parse(JSON.stringify(step));
        this.nodes = newStep.nodes;
        newStep.nodes = newStep.nodes.map(node => {
            delete node.prop;
            Object.assign(node, this.nodeColors);
            return node;
        })
        this.visualizer.setData(newStep);
    }

    componentWillUnmount() {
        this.visualizer.destroy();
        this.visualizer = null;
        this.events.remove('newStep', this.updateNetwork);
    }

    render() {
        return (
            <div id='vis-container' className={`Visualizer ${this.state.theme}`}></div>
        );
    }
}