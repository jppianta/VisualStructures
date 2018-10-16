import { events } from './EventManager';

export class Interpreter {
    scope = [{}];
    typeParse = {
        'number': this.parseNumber.bind(this),
        'bool': this.parseBool.bind(this),
        'Node': this.parseNode.bind(this),
        'void': () => undefined
    }

    constructor() {
        this.events = events.getInstance();
        this.idCount = 0;
    }

    hasCode() {
        return !!this.code;
    }

    setCode(code) {
        this.clearScope();
        this.code = code;
        this.setGlobal();
    }

    executeFunction(functionName, functionParameters = []) {
        const fun = this.getFunction(functionName);
        if (fun) {
            const scope = fun.parameters ? this.createFunctionScope(fun)(functionParameters) : {};
            this.scope.push(scope);
            const returnValue = this.executeBlock(fun.block, fun.type);
            this.scope.pop();
            return returnValue;
        }
    }

    executeBlock(block, functionType) {
        let returnValue;
        (block || []).some(op => {
            const ope = JSON.parse(JSON.stringify(op));
            switch (ope.operation) {
                case 'Declaration':
                    this.handleDeclaration(ope, this.lastScope());
                    break;
                case 'Attribution':
                    this.handleAttribution(ope, this.lastScope());
                    break;
                case 'Function':
                    this.executeFunction(ope.name, ope.parameters);
                    break;
                case 'if':
                    this.handleIf(ope);
                    break;
                case 'while':
                    this.handleWhile(ope);
                    break;
                case 'Return':
                    returnValue = this.handleReturn(ope, functionType);
                    return true;
                default: return false;
            }
            const node = this.findGlobalNode();
            if (node) {
                const step = this.createStepFromNode(node);
                this.events.dispatch('newStep', step);
            }
            return false;
        });
        return returnValue;
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
        return (values) => {
            const parameters = this.parseParameters(fun.parameters);
            const keys = Object.keys(parameters);
            for (let i = 0; i < keys.length; i++) {
                parameters[keys[i]] = values[i] ? this.typeParse[parameters[keys[i]].type](values[i]) : { type: 'Node', value: null };
            }
            return parameters;
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
        return variable.type === 'Node' && variable.value === null;
    }

    parseNode(node) {
        if (this.isNull(node)) {
            return node;
        }
        const name = node.name;
        const parameters = node.parameters;
        if (name !== 'Node') {
            if (node.operation === 'Function') {
                return this.executeFunction(name, parameters);
            }
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
        const value = this.scope[0]['Node'](parameters);
        return {
            type: 'Node',
            value
        }
    }

    parseNumber(variable) {
        if (variable === undefined) return variable;
        if (variable.operation === 'Function') {
            return this.executeFunction(variable.name, variable.parameters);
        }
        const memValue = this.getValueFromMemory(variable, this.lastScope());
        if (memValue) {
            return memValue;
        }
        const value = variable.value;
        const result = Number(value);
        if (!isNaN(result)) {
            variable.value = result;
            return variable;
        }
        if (variable.operation) {
            const operationResult = this.parseNumberOperation(variable.left, variable.right, variable.operation);
            delete variable.left;
            delete variable.right;
            delete variable.operation;
            variable.value = operationResult;
            variable.type = 'number';
            return variable;
        }
        console.error(`Value ${value} is not a number`);
    }

    parseNumberOperation(left, right, op) {
        left = this.parseNumber(left).value;
        right = this.parseNumber(right).value;
        const operators = {
            '+': (d1, d2) => d1 + d2,
            '-': (d1, d2) => d1 - d2,
            '*': (d1, d2) => d1 * d2,
            '/': (d1, d2) => d1 / d2,
        }
        return operators[op](left, right);
    }

    parseBool(op) {
        if (op.operation === 'Function') {
            return this.executeFunction(op.name, op.parameters);
        }
        const memValue = this.getValueFromMemory(op, this.lastScope());
        if (memValue) {
            return memValue;
        }

        let value = this.toBoolean(op.value);
        if (value !== undefined) {
            op.value = value;
            return op;
        }
        if (op.operation) {
            value = this.parseBoolOperator(op.operation, op.left, op.right);
            op.value = value;
            delete op.operation;
            delete op.left;
            delete op.right;
            return op;
        }
    }

    parseBoolOperator(operator, left, right) {
        let sides;
        switch (operator) {
            case '||': return this.parseBool(left).value || this.parseBool(right).value;
            case '&&': return this.parseBool(left).value && this.parseBool(right).value;
            case '<': return this.parseNumber(left).value < this.parseNumber(right).value;
            case '>': return this.parseNumber(left).value > this.parseNumber(right).value;
            case '<=': return this.parseNumber(left).value <= this.parseNumber(right).value;
            case '>=': return this.parseNumber(left).value >= this.parseNumber(right).value;
            case '==':
                sides = this.getBothSides(left, right);
                if (sides) {
                    return sides[0] === sides[1];
                }
                break;
            case '!=':
                sides = this.getBothSides(left, right);
                if (sides) {
                    return sides[0] !== sides[1];
                }
                break;
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
                return [memLeft.value, rightValue.value];
            }
            if (memRight) {
                const type = memRight.type;
                const leftValue = this.typeParse[type](left);
                return [leftValue.value, memRight.value];
            }
            left = this.parseNumber(left);
            right = this.parseNumber(right);
            return [left, right]
        } catch (err) {
            return undefined;
        }
    }

    handleDeclaration(com, scope) {
        if (scope[com.variable]) {
            console.error(`Variable ${com.variable} already declared`);
        } else {
            const parsedValue = this.typeParse[com.type](com.value);
            if (parsedValue !== undefined) {
                scope[com.variable] = parsedValue;
                return true;
            }
            return false;
        }
    }

    handleAttribution(com, scope) {
        this.sustituteValueInMemory(com.variable, scope, com.value);
    }

    handleReturn(com, type) {
        return this.typeParse[type](com.value);
    }

    getLastAccess(com) {
        const arr = JSON.parse(JSON.stringify(com.variable instanceof Array ? com.variable : [com.variable]));
        const arrayVar = arr.slice(1);
        return arrayVar.pop();
    }

    handleIf(ifBlock) {
        const parsedCondition = this.parseBool(ifBlock.condition);
        if (parsedCondition.value) {
            this.scope.push({});
            this.executeBlock(ifBlock.block);
            this.scope.pop();
        } else {
            if (ifBlock.else) {
                this.scope.push({});
                this.executeBlock(ifBlock.else);
                this.scope.pop();
            }
        }
    }

    handleWhile(whileBlock) {
        this.scope.push({});
        while (true) {
            const parsedCondition = this.parseBool(whileBlock.condition);
            if (!parsedCondition.value) {
                this.scope.pop();
                return;
            }
            this.executeBlock(whileBlock.block);
        }
    }

    sustituteValueInMemory(variable, scope, newValue) {
        const arrayVar = variable instanceof Array ? variable : [variable];
        let ret = scope[arrayVar[0]];
        if (!ret) {
            for (let i = this.scope.length - 1; i >= 0; i--) {
                ret = this.scope[i][arrayVar[0]];
                if (ret) {
                    if (arrayVar.length === 1) {
                        this.scope[i][arrayVar[0]] = this.typeParse[this.scope[i][arrayVar[0]].type](newValue);
                        return;
                    }
                    break;
                }
            }
            if (!ret) {
                return console.error(`Variable ${arrayVar[0]} not found`);
            }
        }
        const rest = arrayVar.slice(1);
        const last = rest.pop();
        rest.forEach(element => {
            if (element.type === 'Object') {
                ret = ret.value[element.name];
                if (ret === undefined) {
                    console.error(`Property ${element.name} not found`);
                }
            } else if (element.type === 'Array') {
                ret = ret.value[this.parseNumber(element.index)];
                if (!ret) {
                    console.error(`Index ${element.index} not found`);
                }
            }
        });
        if (last.type === 'Object') {
            if (ret.value[last.name] !== undefined) {
                ret.value[last.name] = this.typeParse[ret.value[last.name].type](newValue);
            } else {
                console.error(`Property ${last.name} not found`);
            }
        } else if (last.type === 'Array') {
            ret.value[this.parseNumber(last.index)] = newValue;
        }
    }

    getValueFromMemory(variable, scope, father) {
        const arrayVar = variable instanceof Array ? variable : [variable];
        return this.getVarFromArray(arrayVar, scope, father);
    }

    getVarFromArray(variable, scope, father = false) {
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
        if (father) {
            rest.pop();
        }
        rest.forEach(element => {
            if (element.type === 'Object') {
                ret = ret.value[element.name];
                if (ret === undefined) {
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
        this.idCount = 0;
        return this.createStepFromNodeRec(node, 0, 0);
    }

    createStepFromNodeRec(node, id, level) {
        const data = {
            nodes: [],
            edges: []
        };
        if (!node.value) return data;
        if (node.$been !== undefined) return {
            id: node.$been
        };
        data.nodes.push({ id, label: String(id), prop: node.value, level });
        node.$been = id;
        const keys = Object.keys(node.value);
        let next;
        level++;
        keys.forEach(key => {
            if (node.value[key].type === 'Node' && node.value[key].value !== null) {
                this.idCount++;
                next = this.idCount;
                const res = this.createStepFromNodeRec(node.value[key], next, level);
                if ('id' in res) {
                    data.edges.push({ from: id, to: res.id, arrows: 'to' });
                } else {
                    data.edges.push({ from: id, to: next, arrows: 'to' });
                    data.edges = data.edges.concat(res.edges);
                    data.nodes = data.nodes.concat(res.nodes);
                }
            }
        });
        delete node.$been;
        return data;
    }
}