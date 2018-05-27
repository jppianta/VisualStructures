import { bindable } from 'aurelia-framework';

export class Run {
    styleContainer;
    @bindable functions: string[];

    constructor() {
        this.styleContainer = {
            'height': '100%',
            'width': '50%',
            'display': 'flex',
            'flex-direction': 'row',
            'float': 'left'
        }
    }
}