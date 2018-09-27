import { events } from './EventManager';

export class Interpreter {
    scope = [{}];
    typeParse = {
        'number': this.parseNumber.bind(this),
        'boolean': this.parseBool.bind(this),
        'Node': this.parseNode.bind(this)
    }

    constructor() {
        this.events = events.getInstance();
    }

    hasCode() {
        return !!this.code;
    }

    setCode(code) {
        this.clearScope();
        this.code = code;
        this.setGlobal();
    }

    executeFunction(functionName, firstTime = false) {
        if (firstTime) {
            
        }
        const fun = this.getFunction(functionName);
        if (fun) {
            const scope = fun.parameters ? this.createFunctionScope(fun)(2, 3) : {};
            this.addScope(scope);
            this.executeBlock(fun.block);
            this.scope.pop();
        }
    }

    executeBlock(block) {
        block.forEach(op => {
            switch (op.operation) {
                case 'Declaration':
                    this.handleDeclaration(op, this.lastScope());
                    break;
                case 'Attribution':
                    this.handleAttribution(op, this.lastScope());
                    break;
                case 'if':
                    this.handleIf(op);
                    break;
                case 'while':
                    this.handleWhile(op);
                    break;
                default: break;
            }
            const node = this.findGlobalNode();
            if (node) {
                const step = this.createStepFromNode(node);
                this.events.dispatch('newStep', step);
            }
        });
    }

    findGlobalNode() {
        const global = this.scope[1];
        const keys = Object.keys(global);
        let result;
        keys.some(key => {
            if (global[key].type === 'Node') {
                result = global[key];
                return true;
            }
            return false;
        });
        return result;
    }

    getFunction(functionName) {
        let result;
        this.code.functions.some(fun => {
            if (fun.name === functionName) {
                result = fun;
                return true;
            }
            return false;
        });
        return result;
    }

    clearScope() {
        this.scope = [{}]; 
    }

    setGlobal() {
        this.clearScope();
        this.scope[0]['Node'] = this.createFunctionScope(this.code.node);
        this.addScope(this.code);
    }

    createFunctionScope(fun) {
        const parameters = this.parseParameters(fun.parameters);
        const keys = Object.keys(parameters);
        return (...values) => {
            for (let i=0; i<keys.length; i++) {
                parameters[keys[i]].value = values[i] ? this.typeParse[parameters[keys[i]].type](values[i]) : null;
            }
            return JSON.parse(JSON.stringify(parameters));
        };
    }

    lastScope() {
        return this.scope[this.scope.length - 1];
    }

    addScope(block) {
        const layer = {};
        block.attributions && block.attributions.forEach(op => {
            switch (op.operation) {
                case 'Declaration':
                    this.handleDeclaration(op, layer);
                    break;
                case 'Attribution':
                    this.handleAttribution(op, layer);
                    break;
                default: break;
            }
        });
        this.scope.push(layer);
    }

    parseParameters(parameters) {
        const result = {}
        const keys = Object.keys(parameters);
        keys.forEach(key => {
            result[key] = {
                type: parameters[key]
            }
        });
        return result;
    }

    isNull(variable) {
        const arrayVar = variable instanceof Array ? variable : [variable];
        const first = arrayVar[0];
        return first === 'null' && arrayVar.length === 1;
    }

    parseNode(node) {
        if (this.isNull(node)) {
            return null;
        }
        const type = node[0];
        const parameters = node[1] && node[1].parameters;
        if (type !== 'Node') {
            const memValue = this.getValueFromMemory(node, this.lastScope());
            if (memValue) {
                return memValue;
            }
            console.error(`${parameters} not a Node`);
            return;
        }
        if (!Array.isArray(parameters)) {
            if (!(parameters === null)) {
                console.error(`${parameters} not a Node`);
                return;
            }
        }
        return this.scope[0]['Node'](parameters);
    }

    parseNumber(value) {
        if (value === undefined) return value;
        const result = Number(value);
        if (!isNaN(result)) {
            return result;
        }
        if (value.operation) {
            return this.parseNumberOperation(value.left, value.right, value.operation);
        }
        const memValue = this.getValueFromMemory(value, this.lastScope());
        if (memValue) {
            return memValue.value;
        }
        console.error(`Value ${value} is not a number`);
    }

    parseNumberOperation(left, right, op) {
        left = this.parseNumber(left);
        right = this.parseNumber(right);
    	const operators = {
        	'+': (d1, d2) => d1+d2,
            '-': (d1, d2) => d1-d2,
            '*': (d1, d2) => d1*d2,
            '/': (d1, d2) => d1/d2,
        }
        return operators[op](left, right);
    }

    parseBool(op) {
        const value = this.toBoolean(op);
        return value ? value : this.parseBoolOperator(op.operation, op.left, op.right);
    }

    parseBoolOperator(operator, left, right) {
        let sides;
        switch (operator) {
            case '||': return this.parseBool(left) || this.parseBool(right);
            case '&&': return this.parseBool(left) && this.parseBool(right);
            case '==': 
                sides = this.getBothSides(left, right);
                if (sides) {
                    return sides[0] === sides[1];
                }
                return this.parseBool(left) === this.parseBool(right);
            case '!=': 
                sides = this.getBothSides(left, right);
                if (sides) {
                    return sides[0] !== sides[1];
                }
                return this.parseBool(left) !== this.parseBool(right);
                default: break;
        } 
    }

    toBoolean(value) {
        switch (value) {
            case 'true': return true;
            case 'false': return false;
            default: break;
        }
    }

    getBothSides(left, right) {
        try {
            const memLeft = this.getValueFromMemory(left, this.lastScope());
            const memRight = this.getValueFromMemory(right, this.lastScope());
            if (memLeft && memRight) {
                return [memLeft.value, memRight.value];
            }
            if (memLeft) {
                const type = memLeft.type;
                const rightValue = this.typeParse[type](right);
                return [memLeft.value, rightValue];
            }
            if (memRight) {
                const type = memRight.type;
                const leftValue = this.typeParse[type](left);
                return [leftValue, memRight.value];
            }
            left = this.parseNumber(left);
            right = this.parseNumber(right);
            return [left, right]
        } catch(err) {
            return undefined;
        }
    }

    handleDeclaration(com, scope) {
        if (scope[com.variable]) {
            console.error(`Variable ${com.variable} already declared`);
        } else {
            this.handleParse(com, scope, true);
        }
    }

    handleAttribution(com, scope) {
        const memValue = this.getValueFromMemory(com.variable, scope);
        if (memValue) {
            if (this.handleParse(com, scope)) {
                return;
            }
        }
        console.error(`Variable ${com.variable} not declared`);
    }

    handleIf(ifBlock) {
        const parsedCondition = this.parseBool(ifBlock.condition);
        if (parsedCondition) {
            this.addScope(ifBlock.block);
            this.executeBlock(ifBlock.block);
            this.scope.pop();
        } else {
            if (ifBlock.else) {
                this.addScope(ifBlock.else);
                this.executeBlock(ifBlock.else);
                this.scope.pop();
            }
        }
    }

    handleWhile(whileBlock) {
        this.addScope(whileBlock.block);
        while (true) {
            const parsedCondition = this.parseBool(whileBlock.condition);
            if (!parsedCondition) {
                this.scope.pop();
                return;
            }
            this.executeBlock(whileBlock.block);
        }
    }

    handleParse(com, scope, dec = false) {
        const memValue = this.getValueFromMemory(com.variable, scope);
        const parsedValue = dec ? 
            this.typeParse[com.type](com.value) : 
            this.typeParse[memValue.type](com.value);
        if (parsedValue !== undefined) {
            if (dec) {
                scope[com.variable] = {
                    type: com.type,
                    value: parsedValue
                };
                return true;
            }
            memValue.value = parsedValue;
            return true;
        }
        return false;
    }

    getValueFromMemory(variable, scope) {
        const arrayVar = variable instanceof Array ? variable : [variable];
        return this.getVarFromArray(arrayVar, scope);
    }

    getVarFromArray(variable, scope) {
        let ret = scope[variable[0]];
        if (!ret) {
            for (let i = this.scope.length - 1; i >= 0; i--) {
                ret = this.scope[i][variable[0]];
                if (ret) {
                    break;
                }
            }
            if (!ret) {
                return undefined;
            }
        }
        const rest = variable.slice(1);
        rest.forEach(element => {
            if (element.type === 'Object') {
                ret = ret.value.type === 'Node' ? ret.value.value[element.name] : ret.value[element.name];
                if (!ret) {
                    console.error(`Property ${element.name} not found`);
                }
            } else if (element.type === 'Array') {
                ret = ret.value[this.parseNumber(element.index)];
                if (!ret) {
                    console.error(`Index ${element.index} not found`);
                }
            }
        });
        return ret;
    }

    createStepFromNode(node) {
        let cont = 0;
        let currentNodeCont = cont;
        const data = {
            nodes: [{id: cont, label: String(cont), prop: node.value}],
            edges: []
        };
        cont++;
        const nodes = [node];
        while (nodes.length > 0) {
            const currentNode = nodes.splice(0, 1)[0];
            const keys = currentNode && Object.keys(currentNode.value);
            keys.forEach(key => {
                if (currentNode.value[key].type === 'Node array') {
                    currentNode.value[key].value.forEach(n => {
                        data.nodes.push({id: cont, label: String(cont), prop: n});
                        data.edges.push({from: currentNodeCont, to: cont, arrows:'to'});
                        nodes.push(n);
                        cont++;
                    });
                } else if (currentNode.value[key].type === 'Node' && currentNode.value[key].value !== null) {
                    data.nodes.push({id: cont, label: String(cont), prop: currentNode.value[key]});
                    data.edges.push({from: currentNodeCont, to: cont, arrows:'to'});
                    nodes.push(currentNode.value[key]);
                    cont++;
                }
            });
            currentNodeCont++;
        }
        return data;
    }
}