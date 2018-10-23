import React, { Component } from 'react';
import { FolderItem } from './FolderItem';

export class FolderStructure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            root: props.root,
        }
    }

    render() {
        return (
            <FolderItem item={this.state.root}/>
        );
    }
}