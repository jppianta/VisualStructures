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

Declaration = type:(Type) _1 vari:Id _ "=" _ value:(IdRS / Number) {
	return {
        operation: "Declaration",
        variable: vari,
        value: value,
    	type: type	
    }
}

Attribution = vari:IdRS _ '=' _ value:(IdRS / Number / Null) {
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

ArrayAccess = v:('[' Number ']') {
	return {
    	type: 'Array',
        index: v[1]
    }
}

ObjectAccess = r:('.' Id) {
	return {
    	type: 'Object',
        name: r[1]
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

Type = "int" / "float" / "void" / "string" / "bool" / "char" / "Node"

Null = 'null'

Number = ch:OneNumber+ {
	return ch.reduce((res, c) => {
    	return res+=c;
    })
}

_ "whitespace"
  = [ \t\n\r]*
              
_1 = [ \t\n\r]+

Bool = b:("true" / "false") { return b === 'true';}

BoolOperator = "&&" / "||" / "==" / "!="

Condition = '(' _ b:BoolOperation _ ')' {
	return b;
}

BoolOperation = c1:(Bool / IdRS) _ op:BoolOperator _ c2:BoolOperation {
	return {
    	operation: op,
        left: c1,
        right: c2
    }
}
/ Bool 
/ IdRS
/ '(' b:BoolOperation ')' {
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

If = "if" _ '(' _ c:BoolOperation _ ')' _ f:FunctionBlock _ e:ElseA {
	return {
    	operation: "if",
        condition: c,
        block: f,
        else: e
    }
}

ElseA = e:("else" _ ElseB)? { return e ? e[2] : null; }

ElseB = If / FunctionBlock

While = "while" _ '(' c:BoolOperation ')' _ f:FunctionBlock {
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

Class = "class" _ i:Id _ '{' _ n:Node _ l:LineCommands _ f:Functions _ '}' {
	return { 
    	operation: "class",
    	node: n,
    	attributions: l,
    	functions: f
    }
}