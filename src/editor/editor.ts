import { edit, config } from 'ace-builds/ace';

export class Editor {
    styleObject: object;
    input: any;
    ele: HTMLElement;

    constructor() {
        this.styleObject = {
            'width': '100%',
            'height': '100%' 
        }
    }

    attached() {
        this.ele = document.getElementById('input');
        this.input = edit(this.ele);
        this.ele.addEventListener('onresize', onresize, false);
    }

    onresize() {
        this.input.resize();
    }

    detached() {
        this.ele.removeEventListener('onresize', onresize);
    }
}