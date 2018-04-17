@{%
	const getChar = function (data) {
        if (data instanceof Array) {
			let res = "";
			for (let i = 0; i < data.length; i++) {
				res += getChar(data[i]);
			}
			return res;
        } else {
            return data;
        }
    }
	
	const attr = function (data) {
		return {
			operation: "attribution",
			variable: data[0],
			value: data[4][0]
		}
	}
	
	const lineCom = function (data) {
		return data[0];
	}
	
	const ifCom = function (data) {
		return {
			operation: "if",
			condition: data[2],
			block: data[4]
		}
	}
	
	const reduc = function (data) {
		while(data instanceof Array) {
			data = data[0];
		}
		return data;
	}
	
	const boolOp = function (data) {
		const res = []
		for (let i=0; i<data.length; i+=2) {
			if (data.length>1) {
				res.push(boolOp(data[i]));
			} else {
				res.push(reduc(data[i]));
			}
		}
		
		return res.length > 1 
			? {
				left: res[0],
				right: res[2],
				operation: res[1]
			}
			:
			res[0];
	}
	
	const con = function (data) {
		return boolOp(data[2]);
	}
	
	const block = function (data) {
		return data[2];
	}
	
	const seq = function (data) {
		const res = []
		res.push(reduc(data[0]));
		res.push(seq(data[2][0]));
		return res;
	}
%}

main -> sequenceA
#(blockCommands):* | (lineCommands):+ | null

id -> (oneChar) (oneNumber | oneChar | oneUnderline):* {% getChar %}
oneChar -> [a-zA-Z]
oneNumber -> [0-9]
oneUnderline -> "_"

number -> oneNumber:+ {% getChar %}
string -> oneChar:+ {% getChar %}

type -> "int" | "float" | "void" | "string" | "bool" | "char"

equals -> "="

oneSpace -> spaces:+ 
zeroSpace -> spaces:* 

spaces -> " " | tab | newline 
tab -> "\t"
newline -> "\n"

blockCommands -> if | while | node | function

lineCommands -> attribution zeroSpace ";" {% lineCom %}

if -> "if" oneSpace condition zeroSpace functionBlock zeroSpace elseA {% ifCom %}
elseA -> null | "else" zeroSpace elseB
elseB -> if | functionBlock

while -> "while" oneSpace condition zeroSpace functionBlock

bool -> "true" | "false"
boolOperator -> "||" | "&&"
boolOperation -> boolOperation zeroSpace boolOperator zeroSpace bool | bool | condition
condition -> "(" zeroSpace boolOperation zeroSpace ")" {% con %}

attribution -> id zeroSpace equals zeroSpace (id | number) {% attr %}

node -> "Node" oneSpace "{" zeroSpace ((reference zeroSpace "," zeroSpace data) | (data zeroSpace "," zeroSpace reference)) zeroSpace "}"
reference -> "reference" zeroSpace ":" zeroSpace "Node" zeroSpace ("[]"):?
data -> "data" zeroSpace ":" zeroSpace (type)

function -> "fun" oneSpace id zeroSpace "(" zeroSpace (parametersA):? zeroSpace ")" zeroSpace ":" zeroSpace type zeroSpace functionBlock 

functionBlock -> "{" zeroSpace (sequenceA | null) "}" {% block %}

sequenceA -> lineCommands zeroSpace sequenceB {% seq %}

sequenceB -> null | sequenceA

parametersA -> id zeroSpace ":" zeroSpace type parametersB

parametersB -> (zeroSpace "," zeroSpace parametersA):?