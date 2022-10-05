@{%
const moo = require("moo");
const graphology_operators = require("graphology-operators");

const graph_string = require("../graph-string.js");

const lexer = moo.compile({
  open: '<|',
  close: '|>',
  separator: '|',
  text: /.+?/
});

%}

@lexer lexer

main -> text_with_choices {%
  ([text_with_choices]) =>
    graph_string.weave(
      new graph_string.GraphString([{offset: -1, text: ""}]),
      text_with_choices
    )
%}

text_with_choices -> %text:* {% ([textarr]) => new graph_string.GraphString(textarr) %}
  | text_with_choices choices_container %text:* {%
  ([text_with_choices, choices_container, textarr]) =>
    graph_string.weave(
      text_with_choices,
      choices_container,
      new graph_string.GraphString(textarr)
    )
%}

choices_container -> %open choices %close {% ([_0, choices, _1]) => choices %}
choices -> text_with_choices {% ([text_with_choices]) => text_with_choices %}
  | choices %separator text_with_choices {%
  ([choices, _, text_with_choices]) =>
    graphology_operators.union(choices, text_with_choices)
%}
