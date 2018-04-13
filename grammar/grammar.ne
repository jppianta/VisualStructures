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
%}

main -> lineCommands
#(blockCommands):* | (lineCommands):+ | null

id -> (oneChar) (oneNumber | oneChar | oneUnderline):* {% getChar %}
oneChar -> [a-zA-Z]
oneNumber -> [0-9]
oneUnderline -> "_"

number -> oneNumber:+ {% getChar %}
string -> oneChar:+ {% getChar %}

type -> "int" | "float" | "void" | "string" | "bool" | "char"

equals -> "="

oneSpace -> spaces:+ {% return " "; %} 
zeroSpace -> spaces:* {% return " "; %}

spaces -> " " | tab | newline 
tab -> "\t"
newline -> "\n"

blockCommands -> if | while | node | function

lineCommands -> attribution zeroSpace ";"

if -> "if" oneSpace condition zeroSpace "{" zeroSpace id zeroSpace "}" zeroSpace else
else -> null | "else" zeroSpace "{" zeroSpace id zeroSpace "}"

while -> "while" oneSpace condition zeroSpace "{" zeroSpace id zeroSpace "}"

bool -> "true" | "false"
boolOperator -> "||" | "&&"
boolOperation -> boolOperation zeroSpace boolOperator zeroSpace bool | bool | condition
condition -> "(" zeroSpace boolOperation zeroSpace ")"

attribution -> id zeroSpace equals zeroSpace (id | number) 

node -> "Node" oneSpace "{" zeroSpace ((reference zeroSpace "," zeroSpace data) | (data zeroSpace "," zeroSpace reference)) zeroSpace "}"
reference -> "reference" zeroSpace ":" zeroSpace "Node" zeroSpace ("[]"):?
data -> "data" zeroSpace ":" zeroSpace (type)

function -> "fun" oneSpace id zeroSpace "(" zeroSpace (parameters):? zeroSpace ")" zeroSpace ":" zeroSpace type zeroSpace functionBlock 

functionBlock -> "{" zeroSpace (sequence | null) zeroSpace "}"

sequence -> (lineCommands) zeroSpace sequence | (lineCommands)

parameters -> id zeroSpace ":" zeroSpace type zeroSpace "," zeroSpace parameters | id zeroSpace ":" zeroSpace type