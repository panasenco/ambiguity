@{%
const moo = require("moo");

const lexer = moo.compile({
  open: '<|',
  close: '|>',
  separator: '|',
  text: /.+?/
});

const textarr_to_nodes = (textarr) =>
    textarr.length > 0
    ? [{key: textarr[0].offset, attributes: {text: textarr.map(t => t.text).join("")}}]
    : [];
%}

@lexer lexer

main -> text_with_choices

text_with_choices -> %text:* {% ([textarr]) => textarr_to_nodes(textarr) %}
  | text_with_choices choices_container %text:* {%
  ([text_with_choices, choices_container, textarr]) =>
    [
      ...text_with_choices,
      ...choices_container,
      textarr_to_nodes(textarr)
    ]
%}

choices_container -> %open choices %close {% ([_0, choices, _1]) => choices %}
choices -> text_with_choices
  | choices %separator text_with_choices {%
  ([choices, _, text_with_choices]) => [...choices, ...text_with_choices]
%}
