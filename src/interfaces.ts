export interface IFunction {
    name: string,
    parameters?: object,
    type: string,
    block: object
}

export interface IDeclaration {
    variable: string,
    value: object | number,   
    type: string
}

export interface IAttribution {
    variable: object,
    value: object | number
}