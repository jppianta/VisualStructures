const nearley = require("nearley");
const grammar = require("./grammar/test.js");
const http = require('http');

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed("foo");

// parser.results is an array of possible parsings.
console.log(parser.results); // [[[[ "foo" ],"\n" ]]]
//create a server object:
/*
http.createServer(function (req, res) {
  res.write(JSON.stringify(parser.results)); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
*/
