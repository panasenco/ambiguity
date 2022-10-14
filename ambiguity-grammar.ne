@{%
const moo = require("moo");
const operators = require("graphology-operators");

const graphstring = require("../graphstring.js");

const lexer = moo.compile({
  choices_start: '<|',
  choices_end: '|>',
  choice_separator: '|',
  char: { match: /[\s\S]/, lineBreaks: true }
});

%}

@lexer lexer

main -> template {%
  ([template]) =>
    graphstring.weave(
      new graphstring.GraphString([{offset: "root", text: ""}]),
      template
    )
%}

template -> null {%
  ([_]) =>
    new graphstring.GraphString([])
%}
template -> non_empty_template {%
  ([non_empty_template]) =>
    non_empty_template
%}

non_empty_template -> %char:+ {%
  ([chars]) =>
    new graphstring.GraphString(chars)
%}
non_empty_template -> template choices_container %char:* {%
  ([template, choices_container, chars]) =>
    graphstring.weave(
      template,
      choices_container,
      new graphstring.GraphString(chars)
    )
%}

choices_container -> %choices_start choices %choices_end {%
  ([_0, choices, _1]) =>
    choices
%}

choices -> empty_choice {%
  ([empty_choice]) => empty_choice
%}
choices -> non_empty_template {%
  ([non_empty_template]) =>
    non_empty_template
%}
choices -> choices %choice_separator empty_choice {%
  ([choices, _, empty_choice]) =>
    operators.union(choices, empty_choice)
%}
choices -> choices %choice_separator non_empty_template {%
  ([choices, _, non_empty_template]) =>
    operators.union(choices, non_empty_template)
%}

empty_choice -> null {%
  ([_], location) => new graphstring.GraphString([{offset: -location, text: ""}])
%}
