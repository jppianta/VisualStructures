import { bindable } from 'aurelia-framework';
import { IFunction } from '../interfaces';

export class FunctionPanel {
    styleContainer;
    @bindable functions: IFunction[];
    @bindable selected;

    constructor() {
        this.styleContainer = {
            'height': '100%',
            'width': '25%',
            'display': 'flex',
            'flex-direction': 'row',
            'float': 'left'
        }
    }
}