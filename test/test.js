var assert = require('assert');

var ambiguity = require("../ambiguity.js");

describe("Parser", function() {
  it("should initialize successfully", function() {
    parser = new ambiguity.Parser();
  });
  it("should parse an empty string into a graph with just the root node", function() {
    parser = new ambiguity.Parser();
    parser.feed("");
    assert.equal(parser.results[0].order, 1);
  });
  it("should parse an empty choice into a node", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    assert.equal(parser.results[0].order, 3);
  });
});
