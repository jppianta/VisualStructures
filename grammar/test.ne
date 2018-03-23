main -> (blockCommands):* | (lineCommands):+ | null

id -> (char) (number | char | underline):*
char -> [a-zA-Z]
number -> [0-9]:+
underline -> "_"

equals -> "="
space -> " " | tab
tab -> "/t"

blockCommands -> if | while

lineCommands -> attribution (space):* ";"

if -> "if" (space):+ condition (space):* "{" (space):* id (space):* "}" (space):* else
else -> null | "else" (space):* "{" (space):* id (space):* "}"

while -> "while" (space):+ condition (space):* "{" (space):* id (space):* "}"

bool -> "true" | "false"
boolOperator -> "||" | "&&"
boolOperation -> boolOperation (space):* boolOperator (space):* bool | bool | condition
condition -> "(" (space):* boolOperation (space):* ")"

attribution -> id (space):* equals (space):* (id | number) 