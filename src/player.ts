export class Player {
    scope: object[] = [{}];
    private typeParse = {
        'number': this.parseNumber,
        'boolean': this.parseBool
    }
    
    constructor(private code: any) { 
        this.setGlobal();
    }

    executeFunction(functionName) {
        const fun = this.getFunction(functionName);
        if (fun) {
            const scope = fun.parameters ? this.createFunctionScope(fun)(2, 3) : {};
            this.addScope(scope);
            this.executeBlock(fun.block);
            this.scope.pop();
        }
    } 

    private getFunction(functionName) {
        let result;
        this.code.functions.some(fun => {
            if (fun.name === functionName) {
                result = fun;
                return true;
            }
        });
        return result;
    }
    
    private setGlobal() {
        this.scope = [];
        this.addScope(this.code);
        this.scope[0]['Node'] = this.createFunctionScope(this.code.node);
        console.log(this.scope);
    }

    get lastScope() {
        return this.scope[this.scope.length - 1];
    }

    private addScope(block) {
        const layer = {};
        block.attributions && block.attributions.forEach(op => {
            switch (op.operation) {
                case 'Declaration':
                    this.handleDeclaration(op, layer);
                    break;
                case 'Attribution':
                    this.handleAttribution(op, layer);
                    break;
            }
        });
        this.scope.push(layer);
    }

    private executeBlock(block) {
        block.forEach(op => {
            switch (op.operation) {
                case 'Declaration':
                    this.handleDeclaration(op, this.lastScope);
                    break;
                case 'Attribution':
                    this.handleAttribution(op, this.lastScope);
                    break;
                case 'if':
                    this.handleIf(op);
                    break;
                case 'while':
                    this.handleWhile(op);
                    break;
            }
        });
    }

    private handleDeclaration(com, scope) {
        if (scope[com.variable]) {
            console.error(`Variable ${com.variable} already declared`);
        } else {
            this.handleParse(com, scope, true);
        }
    }

    private handleAttribution(com, scope) {
        if (scope[com.variable]) {
            if (this.handleParse(com, scope)) {
                return;
            }
        }
        for (let i = this.scope.length - 1; i >= 0; i--) {
            if (this.scope[i][com.variable]) {
                if (this.handleParse(com, this.scope[i])) {
                    return;
                }
            }
        }
        console.error(`Variable ${com.variable} not declared`);
    }

    private handleIf(ifBlock) {
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

    private handleWhile(whileBlock) {
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

    private handleParse(com, scope, dec = false) {
        const memValue = scope[com.variable];
        const parsedValue = dec ? this.typeParse[com.type](com.value) : this.typeParse[memValue.type](com.value);
        if (parsedValue) {
            if (dec) {
                scope[com.variable] = {
                    type: com.type,
                    value: parsedValue
                };
                return true;
            }
            scope[com.variable].value = parsedValue;
            return true;
        }
        return false;
    }

    private createFunctionScope(fun) {
        const parameters = this.parseParameters(fun.parameters);
        const keys = Object.keys(parameters);
        return (...values) => {
            for (let i=0; i<keys.length; i++) {
                parameters[keys[i]].value = values[i];
            }
            return parameters;
        };
    }

    private parseParameters(parameters) {
        const result = {}
        const keys = Object.keys(parameters);
        keys.forEach(key => {
            result[key] = {
                type: parameters[key]
            }
        });
        return result;
    }

    private parseNumber(value) {
        const result = Number(value);
        if (result !== NaN) {
            return result;
        }
        console.error(`Value ${value} is not a number`);
    }

    private parseBool(op) {
        const value = this.toBoolean(op);
        return value ? value : this.parseBoolOperator(op.operation, op.left, op.right);
    }

    private parseBoolOperator(operator, left, right) {
        switch (operator) {
            case '||': return this.parseBool(left) || this.parseBool(right);
            case '&&': return this.parseBool(left) && this.parseBool(right);
        } 
    }

    private toBoolean(value) {
        switch (value) {
            case 'true': return true;
            case 'false': return false;
        }
    }
} 