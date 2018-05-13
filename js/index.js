// init config
var config = new Object();
var configGA;
var runTimeout = 0;
var stopRunning = true;
var population;
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
  config.popSize = 800;
  config.maxGenerations = 200;
  config.maxRuns = 1;
  config.mutateProb = 0.05;
  config.selection = "rank";
  config.fitnessOrder = "asc";
  config.unique_chromosomes = true;
  config.items = [];

  config.max_weight = 400;
  $('#max_weight').append(`Pojemność plecaka: ${config.max_weight}kg`);

  config.bound = '';

  config.items.push(new Item('skarpety', 4, 50, 1));
  config.items.push(new Item('koszulka', 24, 15, 2));
  config.items.push(new Item('spodnie', 48, 10, 2));
  config.items.push(new Item('buty', 60, 20, 1));
  config.items.push(new Item('piwo', 52, 10, 3));
  config.items.push(new Item('mapa', 9, 150, 1));
  config.items.push(new Item('kompas', 13, 35, 1));
  config.items.push(new Item('woda', 153, 200, 2));
  config.items.push(new Item('banan', 27, 60, 3));
  config.items.push(new Item('jabłko', 39, 40, 3));
  config.items.push(new Item('ser', 23, 30, 1));
  config.items.push(new Item('książka', 30, 10, 2));
  config.items.push(new Item('kanapka', 50, 60, 2));
  config.items.push(new Item('cukier', 15, 60, 2));
  config.items.push(new Item('kamera', 32, 30, 1));
  config.items.push(new Item('książka', 30, 10, 2));

  addElementToDOM();
}

initDOMElement();

var knapsackInit = () => {
	var data = new Object();
  data.config = config;

	configGA = data.config;
	console.log('GA');
	runGA();
}

var runGA = () => {
	gen = 0;
	//make initial random population
	population = new Array();
	for (let i = 0; i < configGA.popSize;){
		var object = new Object();
		object.chromosome = generateChromosome();
    object.fitness = 0;
    if (insertIntoPopulation(object, population)) i++;
  }
	stopRunning = false;
	console.log(population);
	geneticAlgorithm();
}

var geneticAlgorithm = () => {
  if (configGA.fitnessOrder === "desc")
		population.sort((a,b) => { return b.fitness-a.fitness });
	else
    population.sort((a,b) => { return a.fitness-b.fitness });

  if (gen > 0) {
    let element = population[population.length-1];
  }

  if (stopRunning || configGA.maxGenerations === gen) {
    let answerPop = population[population.length-1];
		// console.log(answerPop);
		drawList(answerPop);
    return true;
  }

	for (let i = 0; i < population.length; i++) {
    population[i].fitness = measureFitness(population[i].chromosome);
  }

  var newPopulation = new Array();
	for (var i = 0; i < population.length;) {
    var randNumber = _.ceil(Math.random() * 3);
    switch(randNumber) {
      case 1:
        //select one individual based on fitness
        var individual = population[selectFromPopulation()];
				//perform reproduction
				var newIndividual = new Object();
				newIndividual.chromosome = individual.chromosome.slice();
				newIndividual.fitness = individual.fitness;
				//insert copy in new pop
				if (insertIntoPopulation(newIndividual, newPopulation)) i++;
        break;
      case 2:
        //select two individuals based on fitness
        var individual1 = population[selectFromPopulation()];
				var individual2 = population[selectFromPopulation()];
				//perform crossover
				var child1 = new Object();
				var child2 = new Object();
        var xover = _.floor(Math.random()*individual1.chromosome.length);
        
        if (configGA.uniqueChromosomes) {
					var r = _.random();
					if (r < 0.5) {
						child1.chromosome = crossover1(individual1.chromosome,individual2.chromosome);
						child2.chromosome = crossover1(individual1.chromosome,individual2.chromosome);
					} else {
						child1.chromosome = crossover2(individual1.chromosome,individual2.chromosome);
						child2.chromosome = crossover2(individual1.chromosome,individual2.chromosome);						
					}
				} else {
					child1.chromosome = individual1.chromosome.slice(0,xover).concat(individual2.chromosome.slice(xover));
					child2.chromosome = individual2.chromosome.slice(0,xover).concat(individual1.chromosome.slice(xover));
				}
				
				child1.fitness = measureFitness(child1.chromosome);
				child2.fitness = measureFitness(child2.chromosome);
				
				var candidates = new Array();
				candidates.push(individual1);
				candidates.push(individual2);
				candidates.push(child1);
        candidates.push(child2);
        
				if (configGA.fitnessOrder == "desc") {
					candidates.sort((a,b) => { return b.fitness-a.fitness });
        } else {
          candidates.sort((a,b) => { return a.fitness-b.fitness });
        }
        //insert offspring in new pop
				if (insertIntoPopulation(candidates[2], newPopulation)) i++;
				if (insertIntoPopulation(candidates[3], newPopulation)) i++;
        break;
      case 3:
        //select one individual based on fitness
        var individual = population[selectFromPopulation()];
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
				if (insertIntoPopulation(mutant, newPopulation)) i++;
        break;
      default:
    }
  }
  
  pupulation = newPopulation;
  gen++;

  if(!stopRunning){
		runTimeout = setTimeout(geneticAlgorithm(), 50);
	}
}

var drawList = (result) => {
	var result_weight = 0;
	var result_str = "<h3>List zabranych rzeczy</h3><table class='list_elements__content'><thead><tr><td>W plecaku</td><td>Nazwa</td><td>Waga</td><td>Wartość</td><td>Dostępna ilość</td></tr></thead><tbody>";
	
	for (let i = 0; i < configGA.items.length; i++) {
		var countArray = _.filter(result.chromosome, configGA.items[i]);
		result_str += "<tr><td>" + countArray.length + "</td><td>" + configGA.items[i].name + "</td><td>" + configGA.items[i].weight+"kg</td><td>" + configGA.items[i].value + "zł</td><td>" + configGA.items[i].bound + "</td></tr>";
	}
	for (let i = 0; i < result.chromosome.length; i++) {
		result_weight += result.chromosome[i].weight;
	}
	result_str += "</tbody></table><p> Total Value: " + result.fitness + ", Total Weight: " + result_weight + "</p>"
	$('#result').html(result_str);
}

var crossover1 = (parent1, parent2) => {
	//Order crossover
	var A = _.floor(Math.random()*parent1.length);
	var B = _.floor(Math.random()*parent1.length);
	while(A == B)
		B = _.floor(Math.random()*parent1.length);
	if (A > B) {
		var temp = B;
		B = A;
		A = temp;
	}
	var child = new Array(parent1.length);
	//copy A to B from parent 1
	for (let i = A; i < B ; i++) {
		child[i] = parent1[i];
	}
	//fill in the rest of child with parent2's genes
	var parent2_index = 0;
	for (let child_index = 0; child_index < parent1.length; child_index++) {
		if (child[child_index] == undefined) {
			for (;parent2_index < parent1.length; parent2_index++) {
				child[child_index] = parent2[parent2_index];
				break;
			}
		}
	}
	return child;
}

var crossover2 = (parent1, parent2) => {
	//Position-based crossover
	var child = new Array(parent1.length);
	for(let i = 0; i < parent1.length; i++) {
		var r = _.random();
		if (r < 0.5) child[i] = parent1[i];
	}
	//fill in the rest of child with parent2's genes
	var parent2_index = 0;
	for (let child_index = 0; child_index < parent1.length; child_index++) {
		if (child[child_index] == undefined) {
			for (;parent2_index < parent1.length; parent2_index++) {
				child[child_index] = parent2[parent2_index];
				break;
			}
		}
	}
	return child;
}

var insertIntoPopulation = (individual, newPopulation) => {
	//don't insert into population if child violates max weight rule
	var totalWeight = 0;
	for (let i = 0 ; i < individual.chromosome.length; i++) {
		totalWeight += individual.chromosome[i].weight;
  }

  if (totalWeight > configGA.max_weight) return false;

	//don't insert into population if child violates bound rule
	for (let i = 0; i < configGA.items.length; i++) {
    //filter element in chromosome by name and bound value
		var countArray = _.filter(individual.chromosome, configGA.items[i]);
		if (countArray.length > configGA.items[i].bound) {
			return false;
		}
  }
  
	newPopulation.push(individual);
	return true;
}

var selectFromPopulation = () => {
  var r = Math.random()*((population.length*(population.length+1))/2);
	var sum = 0;
	for (let i = 0;i < population.length; i++) {
		for (sum += i; sum > r; r++) return i;
	}
	
	return population.length-1;
}

var measureFitness = (chromosome) => {
	var fitness = 0;
	for (var i = 0; i < chromosome.length; i++) {
    fitness += chromosome[i].value;
	}
	return fitness;
}

//randomly generate a chromosome with elements from list
var generateChromosome = () => {
	var randomChromosome = [];
	var weightSoFar = 0;
  var availableItems = configGA.items.slice();

	while (weightSoFar <= configGA.max_weight && availableItems.length) {
    var index = _.floor(Math.random() * availableItems.length);

		if ((weightSoFar + availableItems[index].weight) <= configGA.max_weight) {
			randomChromosome = randomChromosome.concat(availableItems[index]);
			weightSoFar += availableItems[index].weight;
			var countArray = _.filter(randomChromosome, availableItems[index]);
			
			if (countArray.length >= availableItems[index].bound) availableItems.splice(index, 1);
		} else {
			//item is too big for knapsack, don't use it anymore
			availableItems.splice(index,1);
		}
  }

	return randomChromosome;
}