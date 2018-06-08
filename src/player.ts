export class Player {
    global: object = {};
    
    constructor(private code: any) { }
    
    setGlobal() {
        this.global['Node'] = this.createNodeConstructor();
        this.code.attributions.forEach(op => {
            switch (op.operation) {
                case 'Declaration':
                    this.handleDeclaration(op);
                    break;
                case 'Attribution':
                    this.handleAttribution(op);
                    break;
            }
        });
    }

    private handleDeclaration(com) {
        if (this.global[com.variable]) {
            console.error(`Variable ${com.variable} already declared`);
        } else {
            this.global[com.variable] = {
                type: com.type,
                value: com.value
            };
        }
    }

    private handleAttribution(com) {
        if (!this.global[com.variable]) {
            console.error(`Variable ${com.variable} not declared`);
        } else {
            this.global[com.variable] = com.value;
        }
    }

    private createNodeConstructor() {
        const parameters = this.parseParameters(this.code.node.parameters);
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
} 