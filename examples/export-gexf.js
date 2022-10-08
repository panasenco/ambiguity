const fs = require("fs");

const gexf = require("graphology-gexf");

const ambiguity = require("../ambiguity");

const parser = new ambiguity.Parser();
parser.feed("a<|b|c|><|d|<|e||>f|g|>h<|i|j|>");
g = parser.results[0];
fs.writeFile("./test.gexf", gexf.write(g), (err) => console.log(err));
