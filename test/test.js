const assert = require('assert/strict');

const genetic = require("genetic-js");

const ambiguity = require("../ambiguity.js");

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
  it("should parse text with newlines", function() {
    parser = new ambiguity.Parser();
    parser.feed("{}\n");
    var g = parser.results[0]
    assert.equal(g.order, 2);
    assert(g.hasNode("root"));
    assert(g.hasNode(0));
  });
  it("should generate a graph with working randomPath() function", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    const g = parser.results[0];
    for (let i=0; i < 10; i++) {
      var p = g.randomPath();
      assert(p.length == 2);
    }
  });
  it("should convert a path to a string", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    const g = parser.results[0];
    for (let i=0; i < 10; i++) {
      var p = g.randomPath();
      var s = g.pathToString(p);
      assert(s == "a" || s == "");
    }
  });
  it("should be able to mutate a path", function() {
    parser = new ambiguity.Parser();
    parser.feed("<|a||>");
    const g = parser.results[0];
    for (let i=0; i < 10; i++) {
      var p = g.randomPath();
      var m = g.mutatedPath(p);
      assert(m.length == 2);
    }
  });
  it("should work with genetic.js to evolve the correct solution", function() {
    parser = new ambiguity.Parser();
    parser.feed("a<|a|b|c|><|a|b|><|c|de|><|b|f|>");
    countUniqueChars = (str) => (new Set(str.split(""))).size;
    g = parser.results[0];
    const optimizer = genetic.create();
    var solution = "";
    optimizer.optimize = genetic.Optimize.Maximize;
    optimizer.select1 = genetic.Select1.Tournament2;
    optimizer.seed = () => g.randomPath();
    optimizer.mutate = (path) => g.mutatedPath(path);
    optimizer.fitness = (path) => countUniqueChars(g.pathToString(path));
    optimizer.notification = (pop, generation, stats, isFinished) => {
      if (isFinished) {
        solution = g.pathToString(pop[0].entity);
      }
    }
    optimizer.generation = (pop, generation, stats) => g.pathToString(pop[0].entity) != "acbdef";
    
    var config = { iterations: 100, size: 100, mutation: 0.4, skip: 10 };
    
    optimizer.evolve(config);
    
    assert.equal(solution, "acbdef");
  });
});
