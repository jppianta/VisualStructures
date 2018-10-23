import React, { Component } from 'react';
import { FolderStructure } from '../../FolderStructure';
import { events } from '../../EventManager';

export class NodeInfoBar extends Component {
    constructor(props) {
        super(props);

        this.events = events.getInstance();

        this.events.add('setNode', this.setNode.bind(this));

        this.state = {
            node: {}
        }
    }

    setNode(node) {
        node = node[0];
        console.log(node);
    }

    render() {
        return (
            <FolderStructure root={this.state.node}/>
        );
    }
}