const genetic = require("genetic-js");

const ambiguity = require("../ambiguity");

const countUniqueChars = (str) => (new Set(str.split(""))).size;

const parser = new ambiguity.Parser();
parser.feed("a<|a|b|c|><|a|b|><|c|de|><|b|f|>");
g = parser.results[0];

var optimizer = genetic.create();

optimizer.optimize = genetic.Optimize.Maximize;
optimizer.select1 = genetic.Select1.Tournament2;

optimizer.seed = () => g.randomPath();
optimizer.mutate = (path) => g.mutatedPath(path);
optimizer.fitness = (path) => countUniqueChars(g.pathToString(path));
optimizer.notification = (pop, generation, stats, isFinished) => console.log(isFinished ? "FINISHED: " : "", g.pathToString(pop[0].entity), generation, stats);
optimizer.generation = (pop, generation, stats) => g.pathToString(pop[0].entity) != "acbdef";

var config = { iterations: 100, size: 100, mutation: 0.4, skip: 10 };

optimizer.evolve(config);
