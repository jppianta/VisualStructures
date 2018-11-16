import { events } from './EventManager';
import { Step } from './Step';

class History {
    constructor(al) {
        this.events = events.getInstance();
        this.actionList = al || [];
        this.currentStep = 0;
    }

    pushStep(step) {
        this.actionList.push(new Step(step));
    }

    setStepList(sl) {
        this.actionList = sl.map(action => new Step(action));
        this.currentStep = 0;
        this.displayStep();
    }

    clear() {
        this.actionList = [];
        this.currentStep = 0;
    }

    nextStep() {
        this.currentStep = this.currentStep + 1 === this.actionList.length ? this.currentStep : this.currentStep + 1;
        this.displayStep();
    }

    lastStep() {
        this.currentStep = this.currentStep === 0 ? this.currentStep : this.currentStep - 1;
        this.displayStep();
    }

    jumpToStep(idx) {
        if (idx >=0 && idx < this.actionList.length) {
            this.currentStep = idx;
            this.displayStep();
        }
    }

    displayStep() {
        const step = this.actionList[this.currentStep].getVisualStep();
        this.events.dispatch('newStep', step);
    }
}

export const stepHistory = new History();