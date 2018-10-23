import React, { Component } from 'react';
import { events } from '../../EventManager';
import { Network } from 'vis';

export class Visualizer extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('newStep', this.updateNetwork.bind(this));

        this.visualizer = undefined;

        this.nodes = [];

        this.nodeColors = {
            color: {
                background: '#e5ffff',
                border: '#80cbc4'
            }
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
        this.visualizer.on('click', (e) => {
            console.log(e);
            this.events.dispatch('setNode', e);
        });
        const network = container.firstElementChild;
        network.style.backgroundColor = '#1D1F21';
        const canvas = network.firstElementChild;
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
        this.events.destroy('newStep', this.updateNetwork);
    }

    render() {
        return (
            <div id='vis-container' className="Visualizer"></div>
        );
    }
}