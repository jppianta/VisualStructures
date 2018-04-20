Main = l:(LineCommands _)+ {
	return l.map(c => {
    	return c[0];
    })
}

LineCommands = atr:(Attribution) _ ";" {return atr}

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

Type = "int" / "float" / "void" / "string" / "bool" / "char"

Number = ch:OneNumber+ {
	return ch.reduce((res, c) => {
    	return res+=c;
    })
}

_ "whitespace"
  = [ \t\n\r]*
              
_1 = [ \t\n\r]+

Bool = b:("true" / "false") { return Boolean(b)}