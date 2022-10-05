@{%
const moo = require("moo");

const lexer = moo.compile({
  open: '<|',
  close: '|>',
  separator: '|',
  text: /.+?/
});
%}

@lexer lexer

main -> text_with_choices

text_with_choices -> %text:*
  | text_with_choices choices_container %text:*

choices_container -> %open choices %close
choices -> text_with_choices
  | choices %separator text_with_choices
