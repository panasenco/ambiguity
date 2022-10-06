const graphology = require("graphology");
const operators = require("graphology-operators");

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}

class GraphString extends graphology.Graph {
  constructor(chars, ...args) {
    super(...args);
    if (chars.length > 0) {
      const text = chars.map(t => t.text).join("")
      this.addNode(chars[0].offset, {text: text, label: '"' + text + '"', size: 5});
    }
  }
  nullCopy(_) {
    const graphString = new GraphString(this._options);
    graphString.replaceAttributes(this.getAttributes());
    return graphString;
  }
  randomString(start = "root") {
    const neighbors = this.outNeighbors(start);
    const text = this.getNodeAttribute(start, "text");
    if (neighbors.length == 0) {
      return text;
    } else {
      const randomNeighbor = get_random(neighbors);
      return text + this.randomString(randomNeighbor);
    }
  }
}

function weave2(g0, g1) {
  const g = operators.union(g0, g1);
  for (g0_leaf of g0.filterNodes((node, _) => g0.outDegree(node) == 0)) {
    for (g1_root of g1.filterNodes((node, _) => g1.inDegree(node) == 0)) {
      g.addEdge(g0_leaf, g1_root);
    }
  }
  return g;
}

function weave(...args) {
  if (args.length == 2) {
    return weave2(args[0], args[1]);
  } else if (args.length > 2) {
    return weave2(args[0], weave(...args.slice(1)));
  } else {
    throw `Number of arguments to weave must be 2 or more, got ${args.length}`
  }
}

exports.GraphString = GraphString;
exports.weave = weave;
