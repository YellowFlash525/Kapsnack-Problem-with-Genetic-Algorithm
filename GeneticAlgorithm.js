//config object used to set the parameters of the game. This object is passed to the worker thread to initialize it
var config = new Object();
config.popSize = 800;
config.maxGenerations = 200;
config.maxRuns = 1;
config.mutateProb = 0.05;
config.selection = "rank";
config.fitness_order = "asc";
config.unique_chromosomes = false;

function Item(name,weight,cost,bound) {
	this.name = name;
	this.weight = weight;
	this.cost = cost;
	this.bound = bound;
}

var addElementToList = () => {
  config.items = [];
  config.items.push(new Item('skarpety', 22, 5, 1));
  config.items.push(new Item('bluza', 23, 6, 1));
  config.items.push(new Item('spodnie', 24, 2, 0));
  config.items.push(new Item('buty', 30, 9, 1));
  config.items.push(new Item('krawat', 31, 5, 0));
}

var knapsack_init = () => { 
  config.max_weight = 400;
  
	// if(isNaN(parseInt($('#bound').val()))){
	// 	$('#bound').val('1');
  // }
  
	// config.bound = parseInt($('#bound').val());
  // config.selection = $('#selection').val();
  
  addElementToList();
	
  // $('#result').empty();
  
	var message = new Object();
	message.act = "init";
  message.data = config;
  
  console.log(message.data.items);
}

knapsack_init();