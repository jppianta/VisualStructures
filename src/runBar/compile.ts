import { bindable } from 'aurelia-framework';

export class Compile {
    styleContainer;
    styleButton;
    styleErrorContainer;
    styleErrorMessage;
    @bindable errorMessage: string;

    constructor(private compileButton) {
        this.initStyle();
    }

    initStyle() {
        this.styleContainer = {
            'height': '100%',
            'width': '50%',
            'display': 'flex',
            'flex-direction': 'row',
            'float': 'left'
        }
        this.styleButton = {
            'width': '80px'
        }
        this.styleErrorContainer = {
            'flex': '1'
        }
        this.styleErrorMessage = {
            'padding-left': '2%'
        }
    }

    attached() {
        this.compileButton = document.getElementById('compile');
    }
}