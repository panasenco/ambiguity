var assert = require('assert/strict');

var ambiguity = require("../ambiguity.js");

describe("Ambiguity", function() {
  it("should initialize successfully", function() {
    parser = new ambiguity.Parser();
  });
  it("should parse an empty string into a graph with just the root node", function() {
    parser = new ambiguity.Parser();
    parser.feed("");
    var g = parser.results[0]
    assert.equal(g.order, 1);
    assert(g.hasNode("root"));
  });
  it("should parse an empty choice into a node", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    const g = parser.results[0]
    assert.equal(g.order, 3);
    nodes = g.nodes().sort();
    // The empty choice should have a negative ID
    assert(Number(nodes[0]) < 0);
    // The non-empty choice should have a positive ID
    assert(Number(nodes[1]) > 0);
    // There should be a 'root' node
    assert(nodes[2] == "root");
  });
  it("should generate a graph with working randomString() function", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    const g = parser.results[0];
    const s = g.randomString();
    assert(s == "a" || s == "");
  });
});
