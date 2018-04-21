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

LineCommand = atr:(Attribution) _ ";" {return atr}

BlockCommand = If / While 

Commands = cHead:(LineCommand / BlockCommand) cTail:(_ (LineCommand / BlockCommand))* {
	return [cHead].concat(cTail.map(d => {
    	return d[1];
    }));
}

Attribution = vari:Id _ "=" _ val:(Id / Number) {
	return {
    	operation: "Attribution",
        variable: vari,
        value: val
    }
}

Id = head:(OneChar) tail:(OneChar / OneNumber / Underline)* {
	return head+(tail.length>0 ? tail.reduce((result, ch) => {
    	return result+=ch;
    }) : "");
}
OneChar = [a-zA-Z]
OneNumber = [0-9]
Underline = '_'

Type = "int" / "float" / "void" / "string" / "bool" / "char" / "Node"

Number = ch:OneNumber+ {
	return ch.reduce((res, c) => {
    	return res+=c;
    })
}

_ "whitespace"
  = [ \t\n\r]*
              
_1 = [ \t\n\r]+

Bool = b:("true" / "false") { return Boolean(b)}

BoolOperator = "&&" / "||" / "==" / "!="

Condition = '(' _ b:BoolOperation _ ')' {
	return b;
}
/ Bool 
/ Id 

BoolOperation = c1:Condition _1 op:BoolOperator _1 c2:Condition {
	return {
    	operation: op,
        left: c1,
        right: c2
    }
}

Var = i:Id _ ':' _ t:Type _ v:("[]")? {
	return [i,t+(v ? v : "")]
}

Node = "Node" _ '{' _ p:Parameters _ '}' { 
	return {
    	operation: "node",
        parameters: p
    }
}

If = "if" _ '(' _ c:Condition _ ')' _ f:FunctionBlock _ e:ElseA {
	return {
    	operation: "if",
        condition: c,
        block: f,
        else: e
    }
}

ElseA = e:("else" _ ElseB)? { return e ? e[2] : null; }

ElseB = If / FunctionBlock

While = "while" _ '(' c:Condition ')' _ f:FunctionBlock {
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