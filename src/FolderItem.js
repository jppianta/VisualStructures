import React, { Component } from 'react';

export class FolderItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.item.value,
            children: props.item.children
        }
    }

    render() {
        return (
            <div>
                <div>{this.state.value}</div>
                {
                    (this.state.children || []).length > 0 ? this.state.children.map(child => <FolderItem item={child} />) : ''
                }
            </div>
        );
    }
}