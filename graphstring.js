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
  randomPath(start = "root", bias = []) {
    const neighbors = this.outNeighbors(start);
    if (neighbors.length == 0) {
      return [start];
    } else {
      const biasNeighbors = neighbors.filter(node => bias.includes(node));
      var randomNeighbor;
      if (biasNeighbors.length > 0) {
        randomNeighbor = get_random(biasNeighbors);
      } else {
        randomNeighbor = get_random(neighbors);
      }
      return [start, ...(this.randomPath(randomNeighbor, bias))];
    }
  }
  pathToString(nodeArr) {
    var text = "";
    for (var node of nodeArr) {
        text += this.getNodeAttribute(node, "text");
    }
    return text;
  }
  mutatedPath(nodeArr) {
    const mutationIndex = 1 + Math.floor((Math.random()*(nodeArr.length - 1)));
    const mutationOptions = this.outNeighbors(nodeArr[mutationIndex - 1]);
    const mutatedNode = get_random(mutationOptions);
    return [
      ...(nodeArr.slice(0, mutationIndex)),
      ...(this.randomPath(mutatedNode, nodeArr))
    ];
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
