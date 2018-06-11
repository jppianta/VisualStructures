import { edit, config } from 'ace-builds/ace';

export class Editor {
    private styleObject: object;
    private ele: HTMLElement;
    private input;

    constructor() {
        this.styleObject = {
            'width': '100%',
            'height': '100%' 
        }
        // config.set('modePath', '/VisualStructures');
    }

    async attach() {
        this.ele = document.getElementById('input');
        this.input = edit(this.ele);
        this.input.setMode('/VisualStructures/typescript');
        this.input.setShowPrintMargin(false);
        this.ele.addEventListener('onresize', onresize, false);
    }

    getInput() {
        return this.input;
    }

    onresize() {
        this.input.resize();
    }

    detached() {
        this.ele.removeEventListener('onresize', onresize);
    }
}