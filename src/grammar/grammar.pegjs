M = Class

Relational = '!=' / '==' / Compares

Compares = op:CompareOperators eq:Equals? { return eq ? op + eq : op }
CompareOperators = '>' / '<'
Equals = '='

BoolOperator = "&&" / "||"

PlusMinus = '+' / '-'

MultDiv = '*' / '/'

Expression = left:B _ op:Relational _ right:B {
	return {
        type: 'bool',
    	operation: op,
        left,
        right
    }
}
/ B

B = left:Additive _ op:BoolOperator _ right:B {
	return {
        type: 'bool',
    	operation: op,
        left,
        right
    }
}
/ Additive

Additive = left:Mult _ op:PlusMinus _ right:Additive {
	return {
        type: 'number',
    	operation: op,
        left,
        right
    }
}
/ Mult

Mult = left:Primary _ op:MultDiv _ right:Mult {
	return {
        type: 'number',
    	operation: op,
        left,
        right
    }
}
/ Primary

Primary = Number
/ Bool
/ Null
/ FunctionCall
/ IdRS
/ '(' Expression ')'

LineCommands = l:(LineCommand _)* {
	return l.map(c => {
    	return c[0];
    })
}

Functions = f:(Function _)* {
	return f.map(c => {
    	return c[0];
    })
}

LineCommand = atr:(FunctionCall / Return / Declaration / Attribution) _ ";" {return atr}

BlockCommand = If / While 

Commands = cHead:(LineCommand / BlockCommand) cTail:(_ (LineCommand / BlockCommand))* {
	return [cHead].concat(cTail.map(d => {
    	return d[1];
    }));
}

Declaration = type:(Type) _1 vari:Id _ "=" _ value:Expression {
	return {
        operation: "Declaration",
        variable: vari,
        value: value,
    	type: type	
    }
}

Attribution = vari:IdRS _ '=' _ value:Expression {
	return {
        operation: "Attribution",
        variable: vari,
        value: value	
    }
}

Return = 'return' value:(_1 Expression)? {
    return {
        operation: 'Return',
        value: value && value[1]
    }
}

Id = head:(OneChar) tail:(OneChar / OneNumber / Underline)* {
	return head+(tail.length>0 ? tail.reduce((result, ch) => {
    	return result+=ch;
    }) : "");
}

IdRS = head:Id tail:(RS)* {
    return tail === [] ? [head] : [head].concat(tail);
}

ArrayAccess = '[' _ n: Expression _ ']' {
	return {
    	type: 'Array',
        index: n
    }
}

ObjectAccess = r:('.' Id) {
	return {
    	type: 'Object',
        name: r[1]
    }
}

FunctionAccess = '(' _ v: (Expression (',' _ Expression)*)? _ ')' {
	return {
    	type: 'Function',
        parameters: v ? [v[0]].concat(v[1].map(d => {
        	return d[2]
        })) : []
    }
}

FunctionCall = functionName: Id call:FunctionAccess {
    return {
        operation: call.type,
        parameters: call.parameters,
        name: functionName
    }
}

RS = (ArrayAccess / ObjectAccess)

OneChar = [a-zA-Z]
OneNumber = [0-9]
Underline = '_'

IdAtribbute = head:(Id) tail:('.' Id)* {
	return [head].concat((tail).map(d => {
    	return d[1]
    })).map(d => {
    	return {
        	value: d
        }
    }).reduceRight((res, v) => {
    	v.next = res
        return v
    })
}

Type = 'number' / "void" / "string" / "bool" / "char" / "Node"

Null = 'null' {
	return {
    	type: 'Node',
        value: null
    }
}

Number = ch:OneNumber+ {
	return {
    	type: 'number',
        value: ch.reduce((res, c) => {
    			return res+=c;
    	})
    }
}

_ "whitespace"
  = [ \t\n\r]*
              
_1 = [ \t\n\r]+

Bool = b:("true" / "false") {
	return {
    	type: 'bool',
        value: b
    }; 
}

Condition = '(' _ b: Expression _ ')' {
	return b;
}

Var = t:Type v:("[]")? _1 i:Id {
	return [i,t+(v ? v : "")]
}

Node = "Node" _ '{' _ p:Parameters? _ '}' { 
	return {
    	operation: "node",
        parameters: p || {}
    }
}

If = "if" _ c:Condition _ f:FunctionBlock _ e:ElseA {
	return {
    	operation: "if",
        condition: c,
        block: f,
        else: e
    }
}

ElseA = e:("else" _ ElseB)? { return e ? e[2] : null; }

ElseB = If / FunctionBlock

While = "while" _ c:Condition _ f:FunctionBlock {
	return {
    	operation: "while",
        condition: c,
        block: f
    }
}

FunctionBlock = '{' _ c:Commands? _ '}' { return c; }

Function = "fun" _1 i:Id _ '(' _ p:Parameters? _ ')' _ ':' _ t:Type _ f:FunctionBlock {
	return {
    	operation: "function",
        name: i,
        parameters: p || {},
        type: t,
        block: f
    }
}

Parameters = vHead:(Var) vTail:(_ ',' _ Var)* {
	return [vHead].concat(vTail.map((t) => {
    	return t[3]
    })).map(d => {
    	const aux = {};
        aux[d[0]] = d[1]
    	return aux;
    }).reduce((res, val) => {
    	return Object.assign(res, val);
    })
}

Class = "class" _ i:Id _ '{' _ n:Node _ l:LineCommands _ f:Functions _ '}' _ {
	return { 
    	operation: "class",
    	node: n,
    	attributions: l,
    	functions: f
    }
}
