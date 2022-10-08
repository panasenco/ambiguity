const ambiguity = require("../ambiguity");
const parser = new ambiguity.Parser();
parser.feed("With <|rise of|increase in|> <|productive power|<|economic ||>productivity|>, rent tends to <|rise even higher|even greater increase|>.");
ambiguity_graph = parser.results[0];
console.log(ambiguity_graph.randomString());
