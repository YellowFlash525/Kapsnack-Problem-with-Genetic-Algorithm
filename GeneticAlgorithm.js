const _ = require('lodash');

var kapsnack = (V, W, MAX, popSize, mut, maxGen, percent) => {
    console.log('knapsnack');
};

var generate = (V, popSize) => {
    console.log('generate');
};

var getFitness = (pop, V, W, MAX) => {
    console.log('get fitness');
};

var newPopulation = (pop, fit, mut) => {
    console.log('newPopulation');
};

var selectElite = (pop, fit) => {
   elite = 0;

   for (let i = 0; i < fit.length; i++) {
     if(fit[i] > fit[elite]) {
       elite = i
     }
   }

   return pop[elite];
};

var select = (pop, fit) => {
    console.log('select');
};

var crossover = (mate1, mate2) => {
    lucky = _.random(0, mate1.length-1);
    return mate1.slice(0, lucky) + mate2.splice(lucky, mate2.length);
};

var mutate = (gene, mutate) => {
  for(let i = 0; i < gene.length; i++) {
    let lucky = _.random(1, mutate);
    if (lucky === 1) {
      console.log('Mutated!');
      gene[i] = Boolean(gene[i])^1;
    }
  }

  return gene;
};

var test = (fit, rate) => {
    maxCount = mode(fit);
    (parseFloat(maxCount)/parseFloat(fit.length)) >= rate ? true : false;
};

var mode = (fit) => {
  values = _.uniqBy(fit);
  maxCount = 0;
  for(let i = 0; i < values.length; i++) {
    if(maxCount < _.countBy(fit)) {
      maxCount = _.countBy(fit);
      console.log('whcodzę tu');
    }
  }

  console.log(maxCount);
  return maxCount;
};

module.exports = {kapsnack, generate, selectElite, select, crossover, mutate, test, mode}