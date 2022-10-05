@{%
const moo = require("moo");
const graphology = require("graphology");
const graphology_operators = require("graphology-operators");

const lexer = moo.compile({
  open: '<|',
  close: '|>',
  separator: '|',
  text: /.+?/
});

function textgraph(textarr) {
  const g = new graphology.Graph({type: "directed"});
  if (textarr.length > 0) {
    g.addNode(textarr[0].offset, {text: textarr.map(t => t.text).join("")});
  }
  return g;
}

function weave2(g0, g1) {
  const g = graphology_operators.union(g0, g1);
  for (g0_leaf of g0.filterNodes((node, _) => g0.outDegree(node) == 0)) {
    for (g1_root of g1.filterNodes((node, _) => g1.inDegree(node) == 0)) {
      g.addEdge(g0_leaf, g1_root);
    }
  }
  return g;
}

function weave3(g0, g1, g2) {
  return weave2(weave2(g0, g1), g2);
}
%}

@lexer lexer

main -> text_with_choices {%
  ([text_with_choices]) =>
  weave2(textgraph([{offset: -1, text: ""}]), text_with_choices)
%}

text_with_choices -> %text:* {% ([textarr]) => textgraph(textarr) %}
  | text_with_choices choices_container %text:* {%
  ([text_with_choices, choices_container, textarr]) =>
    weave3(text_with_choices, choices_container, textgraph(textarr))
%}

choices_container -> %open choices %close {% ([_0, choices, _1]) => choices %}
choices -> text_with_choices {% ([text_with_choices]) => text_with_choices %}
  | choices %separator text_with_choices {%
  ([choices, _, text_with_choices]) => graphology_operators.union(choices, text_with_choices)
%}
