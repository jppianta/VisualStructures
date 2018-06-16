export interface IFunction {
    operation: string,
    name: string,
    parameters?: object,
    type: string,
    block: object
}

export interface IDeclaration {
    operation: string,
    variable: string,
    value: object | number,   
    type: string
}

export interface IAttribution {
    operation: string,
    variable: object,
    value: object | number
}

export interface INode {
    operation: string,
    parameters: object[]
}

export interface IClass {
    operation: string,
    node: INode,
    functions: IFunction[],
    attributions: (IDeclaration | IAttribution)[]
}

export interface IDataStep {
    nodes,
    edges
}