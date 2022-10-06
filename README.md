# ambiguity

If you're looking to <|optimize your resume for ATS|generate unique articles for SEO|express what the voices in your head are telling you|>, then you <|need|will love|> **ambiguity**, a templating language for text with multiple <|possibilities|choices|alternatives|>. 

## Usage

First, install the package.

```
npm install github:panasenco/ambiguity
```

Then, use it in your JavaScript code:
```
const ambiguity = require("ambiguity");
const parser = new ambiguity.Parser();
parser.feed("With <|rise of|increase in|> <|productive power|<|economic ||>productivity|>, rent tends to <|rise even higher|even greater increase|>.");
ambiguity_graph = parser.results[0];
console.log(ambiguity_graph.randomString());
```

This will log a random variation of your ambiguity template, for example:

> With increase in productive power, rent tends to even greater increase.

## How it works

Ambiguity compiles your templates into a [graph-structured string](https://en.wikipedia.org/wiki/Graph-structured_stack). The heavy lifting is done by [Nearley](https://nearley.js.org/) and [Moo](https://github.com/no-context/moo).
