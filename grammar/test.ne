main -> id
#(blockCommands):* | (lineCommands):+ | null

id -> (char) (number | char | underline):* {%
    function getChar(data) {
        if (data instanceof Array) {
            if(data.length === 1) {
                console.log("0", data);
                return getChar(data[0]);
            } else {
                console.log("1", data);
                let res = "";
                for (let i = 0; i < data.length; i++) {
                    res += data[i][0];
                }
                return res;
            }
        } else {
            console.log(data);
            return data;
        }
    }
%}
char -> [a-zA-Z]
number -> [0-9]
underline -> "_"
type -> "int" | "float" | "void" | "string" | "bool" | "char"

equals -> "="

oneSpace -> spaces:+ {% data => { return " "; } %} 
zeroSpace -> spaces:* {% 
    data => { 
        if (data[0].length === 0) {
            return "";
        } else {
            return " ";
        }
    } 
%}

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