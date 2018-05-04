// init config
var config = new Object();
var configGA;
var runTimeout = 0;
var stop_running = true;
var population;
var run;
var gen;

function Item(name, weight, value, bound) {
	this.name = name;
	this.weight = weight;
	this.value = value;
	this.bound = bound;
}

var addElementToDOM = () => {
  _.forEach(config.items, (item) => {
    $('#items_list').append(`
      <tr>
        <td>${item.name}</td>
        <td>${item.weight}</td>
        <td>${item.value}</td>
        <td>${item.bound}</td>
      </tr>
    `);
  });
}

var initDOMElement = () => {
  config.popSize = 600; //change to 800
  config.maxGenerations = 200;
  config.maxRuns = 1;
  config.mutateProb = 0.05;
  config.selection = "rank";
  config.fitness_order = "asc";
  config.unique_chromosomes = false;
  config.items = [];

  config.max_weight = 400;
  $('#max_weight').append(`Pojemność plecaka: ${config.max_weight}`);

  config.bound = '';

  config.items.push(new Item('skarpety', 4, 50, 1));
  config.items.push(new Item('koszulka', 24, 15, 2));
  config.items.push(new Item('spodnie', 48, 10, 2));
  config.items.push(new Item('buty', 60, 20, 1));
  config.items.push(new Item('piwo', 52, 10, 3));
  config.items.push(new Item('mapa', 9, 150, 1));
  config.items.push(new Item('kompas', 15, 35, 1));
  config.items.push(new Item('woda', 153, 200, 2));
  config.items.push(new Item('banan', 27, 60, 3));
  config.items.push(new Item('jabłko', 39, 40, 3));
  config.items.push(new Item('ser', 23, 30, 1));
  config.items.push(new Item('książka', 30, 10, 2));

  addElementToDOM();
}

initDOMElement();

var knapsack_init = () => {
  $('#result').empty();

	var data = new Object();
	data.act = "init";
  data.config = config;

  switch(data.act){
		case 'pause':
			stop_running = true;
      if(runTimeout) clearTimeout(runTimeout);
      console.log('Pause');
			break;
		case 'init':
      let configGA = data.config;
      console.log('GA');
			run = 0;
			runGA(configGA);
			break;
	}
}

var runGA = (configGA) => {
	gen = 0;
	//make initial random population
	population = new Array();
	for (let i = 0; i < configGA.popSize;){
		var object = new Object();
		object.chromosome = generateChromosome(configGA.items, configGA.max_weight);
    object.fitness = 0;
    if (insertIntoPopulation(object, population, configGA.max_weight)) i++;
  }
  console.log(population);
	stop_running = false;
	geneticAlgorithm(configGA, population);
}

var geneticAlgorithm = (configGA, population) => {
  if (config.fitness_order === "desc")
		population.sort((a,b) => { return b.fitness-a.fitness });
	else
    population.sort((a,b) => { return a.fitness-b.fitness });

	for (let i = 0; i < population.length; i++) {
    population[i].fitness = measureFitness(population[i].chromosome);
  }

  var newPopulation = new Array();
	for (var i = 0; i < population.length;) {
    var randNumber = _.ceil(_.random(1,3));
    // console.log(randNumber);
    switch(randNumber) {
      case 1:
        //select one individual based on fitness
        var individual = population[selectFromPopulation(configGA, population)];
				//perform reproduction
				var newIndividual = new Object();
				newIndividual.chromosome = individual.chromosome.slice();
				newIndividual.fitness = individual.fitness;
				//insert copy in new pop
				if(insertIntoPopulation(newIndividual, newPopulation, configGA.items, configGA.max_weight)) i++;
        break;
      case 2:
        //select two individuals based on fitness
        i++;
        console.log("case 2");
        break;
      case 3:
        //select one individual based on fitness
        var individual = population[selectFromPopulation(configGA, population)];
				//perform mutation
				var mutant = new Object();
				mutant.chromosome = individual.chromosome.slice();
				var r = _.random();
				var x1 = _.floor(Math.random()*mutant.chromosome.length);
        var x2 = _.floor(Math.random()*mutant.chromosome.length);
        
				if (r < 0.5) {
					//Mutate 1 - reciprocal exchange
					var temp = mutant.chromosome[x1];
					mutant.chromosome[x1] = mutant.chromosome[x2];
					mutant.chromosome[x2] = temp;
				} else {
					//Mutate 2 - insertion
					var tempC = mutant.chromosome.splice(x1,1);
					var tempA = mutant.chromosome.splice(x2);
					mutant.chromosome = mutant.chromosome.concat(tempC.concat(tempA));
        }
        
				mutant.fitness = measureFitness(mutant.chromosome);
				//insert mutant in new pop
				if (insertIntoPopulation(mutant, newPopulation, configGA.items, configGA.max_weight)) i++;
        break;
      default:
    }
  }
  
  pupulation = newPopulation;

  console.log(pupulation);
  gen++;
  // console.log(population);
}

var insertIntoPopulation = (individual, newPopulation, items, maxWeight) => {
	//don't insert into population if child violates max weight rule
	var totalWeight = 0;
	for (let i = 0 ; i < individual.chromosome.length; i++) {
		totalWeight += individual.chromosome[i].weight;
  }

  if (totalWeight > maxWeight) return false;

	//don't insert into population if child violates bound rule
	for (let i = 0; i < items.length; i++) {
    //filter element in chromosome by name and bound value
		var countArray = individual.chromosome.filter(getItemsFilter, items[i]);
		if (countArray.length > items[i].bound) {
			return false;
		}
  }
  
	newPopulation.push(individual);
	return true;
}

var selectFromPopulation = (config, pop) => {
  var choices = new Array();

  for (let i = 0 ; i < 5 ; i++) {
    var rnum = _.floor(Math.random() * pop.length);
    choices[i] = pop[rnum];
    choices[i].index = rnum;
  }

  if (config.fitness_order == "desc") {
    choices.sort( function (a,b) { return b.fitness-a.fitness });
  } else {
    choices.sort( function (a,b) { return a.fitness-b.fitness });
  }

  var r = _.random(0, 1);
  //p = 0.5
  if (r < 0.5) {
    //return most fit
    return choices[choices.length-1].index;
  }

  //otherwise, return a random choice
  var rnum = _.floor(Math.random() * choices.length);
  return choices[rnum].index;
}

var measureFitness = (chromosome) => {
	var fitness = 0;
	for (var i = 0; i < chromosome.length; i++) {
    fitness += chromosome[i].value;
	}
	return fitness;
}

var getItemsFilter = (item) => {
	return this === item;
}

//randomly generate a chromosome with elements from list
var generateChromosome = (items, maxWeight) => {
	var randomChromosome = [];
	var weightSoFar = 0;
  var availableItems = items.slice();

	while (weightSoFar <= maxWeight && availableItems.length) {
    var index = _.floor(Math.random() * availableItems.length);

		if ((weightSoFar + availableItems[index].weight) <= maxWeight) {
			randomChromosome = randomChromosome.concat(availableItems[index]);
			weightSoFar += availableItems[index].weight;
			var countArray = randomChromosome.filter(getItemsFilter, availableItems[index]);
			
			if (countArray.length >= availableItems[index].bound) availableItems.splice(index,1);
		} else {
			//item is too big for knapsack, don't use it anymore
			availableItems.splice(index,1);
		}
  }

	return randomChromosome;
}