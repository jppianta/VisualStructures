export class Humanizer {
    types = {
        'number': this.humanizeNumber.bind(this),
        'bool': this.humanizeBool.bind(this),
        'Node': this.humanizeNode.bind(this)
    }

    humanizeStep(step) {
        switch (step.operation) {
            case 'Declaration':
                return this.humanizeDeclaration(step);
            case 'Attribution':
                return this.humanizeAttribution(step);
            case 'Function':
                return this.humanizeFunction(step);
            case 'if':
                return this.humanizeIf(step);
            case 'while':
                return this.humanizeWhile(step);
            case 'Return':
                return;
            default: return false;
        }
    }

    humanizeDeclaration(step) {
        return `${step.type} ${step.variable} = ${step.value.type ? this.types[step.value.type](step.value) : this.humanizeFunction(step.value)}`
    }

    humanizeAttribution(step) {
        return `${this.humanizeVariable(step.variable)} = ${step.value.type ? this.types[step.value.type](step.value) : this.humanizeFunction(step.value)}`
    }

    humanizeNumber(op) {
        if (op.operation === 'Function') {
            return this.humanizeFunction(op);
        }
        if (op.operation) {
            return `(${this.humanizeNumber(op.left)} ${op.operation} ${this.humanizeNumber(op.right)})`
        }
        if (Array.isArray(op.value)) {
            return this.humanizeVariable(op.value);
        }
        return op.value;
    }

    humanizeNode(op) {
        if (op.operation === 'Function') {
            return this.humanizeFunction(op);
        }
        if (Array.isArray(op.value)) {
            return this.humanizeVariable(op.value);
        }
        if (Array.isArray(op.value)) {
            return this.humanizeVariable(op.value);
        }
        return op.value;
    }

    humanizeBool(op) {
        if (op.operation === 'Function') {
            return this.humanizeFunction(op);
        }
        if (op.operation) {
            return `(${this.humanizeBool(op.left)} ${op.operation} ${this.humanizeBool(op.right)})`
        }
        return op.value;
    }

    humanizeIf(op) {
        return `if (${this.humanizeBool(op.condition)})`
    }

    humanizeWhile(op) {
        return `while (${this.humanizeBool(op.condition)})`
    }

    humanizeFunction(op) {
        if (Array.isArray(op)) {
            return this.humanizeVariable(op);
        }
        return `${op.name}(${this.humanizeParameters(op.parameters)})`;
    }

    humanizeParameters(parameters) {
        const res = parameters.reduce((current, parameter) => {
            return current + (parameter.type ? this.types[parameter.type](parameter) : this.humanizeVariable(parameter)) + ', ';
        }, '') || '';
        if (res.endsWith(', ')) {
            return res.slice(0, -2);
        }
        return res;
    }

    humanizeVariable(variable) {
        const arrayVar = variable instanceof Array ? variable : [variable];
        const first = arrayVar[0];
        const rest = arrayVar.slice(1);
        return rest.reduce((current, access) => {
            return current + (access.type === 'Object' ? `.${access.name}` : `[${access.index}]`)
        }, first);
    }
}