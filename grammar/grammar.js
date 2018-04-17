// Generated automatically by nearley, version 2.13.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["sequenceA"]},
    {"name": "id$subexpression$1", "symbols": ["oneChar"]},
    {"name": "id$ebnf$1", "symbols": []},
    {"name": "id$ebnf$1$subexpression$1", "symbols": ["oneNumber"]},
    {"name": "id$ebnf$1$subexpression$1", "symbols": ["oneChar"]},
    {"name": "id$ebnf$1$subexpression$1", "symbols": ["oneUnderline"]},
    {"name": "id$ebnf$1", "symbols": ["id$ebnf$1", "id$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "id", "symbols": ["id$subexpression$1", "id$ebnf$1"], "postprocess": getChar},
    {"name": "oneChar", "symbols": [/[a-zA-Z]/]},
    {"name": "oneNumber", "symbols": [/[0-9]/]},
    {"name": "oneUnderline", "symbols": [{"literal":"_"}]},
    {"name": "number$ebnf$1", "symbols": ["oneNumber"]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", "oneNumber"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": getChar},
    {"name": "string$ebnf$1", "symbols": ["oneChar"]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", "oneChar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": ["string$ebnf$1"], "postprocess": getChar},
    {"name": "type$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$1"]},
    {"name": "type$string$2", "symbols": [{"literal":"f"}, {"literal":"l"}, {"literal":"o"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$2"]},
    {"name": "type$string$3", "symbols": [{"literal":"v"}, {"literal":"o"}, {"literal":"i"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$3"]},
    {"name": "type$string$4", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$4"]},
    {"name": "type$string$5", "symbols": [{"literal":"b"}, {"literal":"o"}, {"literal":"o"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$5"]},
    {"name": "type$string$6", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "type", "symbols": ["type$string$6"]},
    {"name": "equals", "symbols": [{"literal":"="}]},
    {"name": "oneSpace$ebnf$1", "symbols": ["spaces"]},
    {"name": "oneSpace$ebnf$1", "symbols": ["oneSpace$ebnf$1", "spaces"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "oneSpace", "symbols": ["oneSpace$ebnf$1"]},
    {"name": "zeroSpace$ebnf$1", "symbols": []},
    {"name": "zeroSpace$ebnf$1", "symbols": ["zeroSpace$ebnf$1", "spaces"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "zeroSpace", "symbols": ["zeroSpace$ebnf$1"]},
    {"name": "spaces", "symbols": [{"literal":" "}]},
    {"name": "spaces", "symbols": ["tab"]},
    {"name": "spaces", "symbols": ["newline"]},
    {"name": "tab", "symbols": [{"literal":"\t"}]},
    {"name": "newline", "symbols": [{"literal":"\n"}]},
    {"name": "blockCommands", "symbols": ["if"]},
    {"name": "blockCommands", "symbols": ["while"]},
    {"name": "blockCommands", "symbols": ["node"]},
    {"name": "blockCommands", "symbols": ["function"]},
    {"name": "lineCommands", "symbols": ["attribution", "zeroSpace", {"literal":";"}], "postprocess": lineCom},
    {"name": "if$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "if", "symbols": ["if$string$1", "oneSpace", "condition", "zeroSpace", "functionBlock", "zeroSpace", "elseA"], "postprocess": ifCom},
    {"name": "elseA", "symbols": []},
    {"name": "elseA$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elseA", "symbols": ["elseA$string$1", "zeroSpace", "elseB"]},
    {"name": "elseB", "symbols": ["if"]},
    {"name": "elseB", "symbols": ["functionBlock"]},
    {"name": "while$string$1", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "while", "symbols": ["while$string$1", "oneSpace", "condition", "zeroSpace", "functionBlock"]},
    {"name": "bool$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$1"]},
    {"name": "bool$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$2"]},
    {"name": "boolOperator$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "boolOperator", "symbols": ["boolOperator$string$1"]},
    {"name": "boolOperator$string$2", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "boolOperator", "symbols": ["boolOperator$string$2"]},
    {"name": "boolOperation", "symbols": ["boolOperation", "zeroSpace", "boolOperator", "zeroSpace", "bool"]},
    {"name": "boolOperation", "symbols": ["bool"]},
    {"name": "boolOperation", "symbols": ["condition"]},
    {"name": "condition", "symbols": [{"literal":"("}, "zeroSpace", "boolOperation", "zeroSpace", {"literal":")"}], "postprocess": con},
    {"name": "attribution$subexpression$1", "symbols": ["id"]},
    {"name": "attribution$subexpression$1", "symbols": ["number"]},
    {"name": "attribution", "symbols": ["id", "zeroSpace", "equals", "zeroSpace", "attribution$subexpression$1"], "postprocess": attr},
    {"name": "node$string$1", "symbols": [{"literal":"N"}, {"literal":"o"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "node$subexpression$1$subexpression$1", "symbols": ["reference", "zeroSpace", {"literal":","}, "zeroSpace", "data"]},
    {"name": "node$subexpression$1", "symbols": ["node$subexpression$1$subexpression$1"]},
    {"name": "node$subexpression$1$subexpression$2", "symbols": ["data", "zeroSpace", {"literal":","}, "zeroSpace", "reference"]},
    {"name": "node$subexpression$1", "symbols": ["node$subexpression$1$subexpression$2"]},
    {"name": "node", "symbols": ["node$string$1", "oneSpace", {"literal":"{"}, "zeroSpace", "node$subexpression$1", "zeroSpace", {"literal":"}"}]},
    {"name": "reference$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"f"}, {"literal":"e"}, {"literal":"r"}, {"literal":"e"}, {"literal":"n"}, {"literal":"c"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reference$string$2", "symbols": [{"literal":"N"}, {"literal":"o"}, {"literal":"d"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reference$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"["}, {"literal":"]"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "reference$ebnf$1$subexpression$1", "symbols": ["reference$ebnf$1$subexpression$1$string$1"]},
    {"name": "reference$ebnf$1", "symbols": ["reference$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "reference$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "reference", "symbols": ["reference$string$1", "zeroSpace", {"literal":":"}, "zeroSpace", "reference$string$2", "zeroSpace", "reference$ebnf$1"]},
    {"name": "data$string$1", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data$subexpression$1", "symbols": ["type"]},
    {"name": "data", "symbols": ["data$string$1", "zeroSpace", {"literal":":"}, "zeroSpace", "data$subexpression$1"]},
    {"name": "function$string$1", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "function$ebnf$1$subexpression$1", "symbols": ["parametersA"]},
    {"name": "function$ebnf$1", "symbols": ["function$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "function$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "function", "symbols": ["function$string$1", "oneSpace", "id", "zeroSpace", {"literal":"("}, "zeroSpace", "function$ebnf$1", "zeroSpace", {"literal":")"}, "zeroSpace", {"literal":":"}, "zeroSpace", "type", "zeroSpace", "functionBlock"]},
    {"name": "functionBlock$subexpression$1", "symbols": ["sequenceA"]},
    {"name": "functionBlock$subexpression$1", "symbols": []},
    {"name": "functionBlock", "symbols": [{"literal":"{"}, "zeroSpace", "functionBlock$subexpression$1", {"literal":"}"}], "postprocess": block},
    {"name": "sequenceA", "symbols": ["lineCommands", "zeroSpace", "sequenceB"], "postprocess": seq},
    {"name": "sequenceB", "symbols": []},
    {"name": "sequenceB", "symbols": ["sequenceA"]},
    {"name": "parametersA", "symbols": ["id", "zeroSpace", {"literal":":"}, "zeroSpace", "type", "parametersB"]},
    {"name": "parametersB$ebnf$1$subexpression$1", "symbols": ["zeroSpace", {"literal":","}, "zeroSpace", "parametersA"]},
    {"name": "parametersB$ebnf$1", "symbols": ["parametersB$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "parametersB$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "parametersB", "symbols": ["parametersB$ebnf$1"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
