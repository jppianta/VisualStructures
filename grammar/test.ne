main -> (blockCommands):* | (lineCommands):+ | null

id -> (char) (number | char | underline):*
char -> [a-zA-Z]
number -> [0-9]:+
underline -> "_"
type -> "int" | "float" | "void" | "string" | "bool" | "char"

equals -> "="
space -> " " | tab | newline
tab -> "\t"
newline -> "\n"

blockCommands -> if | while | node | function

lineCommands -> attribution (space):* ";"

if -> "if" (space):+ condition (space):* "{" (space):* id (space):* "}" (space):* else
else -> null | "else" (space):* "{" (space):* id (space):* "}"

while -> "while" (space):+ condition (space):* "{" (space):* id (space):* "}"

bool -> "true" | "false"
boolOperator -> "||" | "&&"
boolOperation -> boolOperation (space):* boolOperator (space):* bool | bool | condition
condition -> "(" (space):* boolOperation (space):* ")"

attribution -> id (space):* equals (space):* (id | number) 

node -> "Node" (space):+ "{" (space):* ((reference (space):* "," (space):* data) | (data (space):* "," (space):* reference)) (space):* "}"
reference -> "reference" (space):* ":" (space):* "Node" (space):* ("[]"):?
data -> "data" (space):* ":" (space):* (type)

function -> "fun" (space):+ id (space):* "(" (space):* (parameters):? (space):* ")" (space):* ":" (space):* type

parameters -> id (space):* ":" (space):* type (space):* "," (space):* parameters | id (space):* ":" (space):* type