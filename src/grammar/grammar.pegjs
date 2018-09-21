{
	function parseOperation(op, c1, c2) {
    	c1 = Number(c1);
        c2 = Number(c2);
    	const operators = {
        	'+': (d1, d2) => d1+d2,
            '-': (d1, d2) => d1-d2,
            '*': (d1, d2) => d1*d2,
            '/': (d1, d2) => d1/d2,
        }
        return String(operators[op](c1,c2));
    }
}

M = Class

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

LineCommand = atr:(Declaration / Attribution) _ ";" {return atr}

BlockCommand = If / While 

Commands = cHead:(LineCommand / BlockCommand) cTail:(_ (LineCommand / BlockCommand))* {
	return [cHead].concat(cTail.map(d => {
    	return d[1];
    }));
}

Declaration = type:(Type) _1 vari:Id _ "=" _ value:(IdRS / Expression) {
	return {
        operation: "Declaration",
        variable: vari,
        value: value,
    	type: type	
    }
}

Attribution = vari:IdRS _ '=' _ value:(IdRS / Expression / Null) {
	return {
        operation: "Attribution",
        variable: vari,
        value: value	
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

FunctionAccess = '(' _ v: ((IdRS / Expression / Null) (',' _ (IdRS / Expression / Null))*)? _ ')' {
	return {
    	type: 'Function',
        parameters: v ? [v[0]].concat(v[1].map(d => {
        	return d[2]
        })) : []
    }
}

RS = (ArrayAccess / ObjectAccess / FunctionAccess)

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

Null = 'null'

Expression
  = head:Term tail:(_ NumberOperator1 _ Term)* {
      return tail.reduce(function(result, element) {
      	const left = result;
        const right = element[3];
        const op = element[1];
        return Number(left) && Number(right) ? parseOperation(element[1], result, element[3]) : {
        	operation: op,
            left,
            right
        };
      }, head);
    }

Term
  = head:Factor tail:(_ NumberOperator2 _ Factor)* {
      return tail.reduce(function(result, element) {
      	const left = result;
        const right = element[3];
        const op = element[1];
        return Number(left) && Number(right) ? parseOperation(element[1], result, element[3]) : {
        	operation: op,
            left,
            right
        };
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Number
  / IdRS

Number = ch:OneNumber+ {
	return ch.reduce((res, c) => {
    	return res+=c;
    })
}

NumberOperator1 = '+' / '-'
NumberOperator2 = '*' / '/'

Compares = op:CompareOperators eq:Equals? { return eq ? op + eq : op }
CompareOperators = '>' / '<'
Equals = '='

CompareOperation = exp1:Expression _ op:(Compares) _ exp2:Expression {
    return {
        operation: op,
        left: exp1,
        right: exp2
    }
}
/ '(' _ b: CompareOperation _ ')' { return b }

_ "whitespace"
  = [ \t\n\r]*
              
_1 = [ \t\n\r]+

Bool = b:("true" / "false") { return b; }

BoolOperator = "&&" / "||"

EqualityOperators = "==" / "!="

EqualityOperation = c1:(BoolFactor / Expression / IdRS) _ tail:EqualityOperation2? {
    return tail ? Object.assign({left: c1}, tail) : c1
}

EqualityOperation2 = op:EqualityOperators c2:EqualityOperation {
    return {
        operation: op,
        right: c2
    }
}

Condition = '(' _ b:(EqualityOperation / CompareOperation / BoolOperation) _ ')' {
	return b;
}

BoolOperation = c1: BoolFactor _ tail:BoolOperation2? {
    return tail ? Object.assign({left: c1}, tail) : c1
}

BoolOperation2 = op:(BoolOperator) _ c2:BoolOperation {
    return {
        operation: op,
        right: c2
    }
}

BoolFactor = Bool / IdRS / '(' _ b:BoolOperation _ ')' {
	return b;
}


Var = t:Type v:("[]")? _1 i:Id {
	return [i,t+(v ? v : "")]
}

Node = "Node" _ '{' _ p:Parameters _ '}' { 
	return {
    	operation: "node",
        parameters: p
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
        parameters: p,
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
