const nearley = require("nearley");

const ambiguity_grammar = require("./dist/ambiguity-grammar.js");

class Parser extends nearley.Parser {
  constructor(...args) {
    super(nearley.Grammar.fromCompiled(ambiguity_grammar), ...args);
  }
}

exports.Parser = Parser;
