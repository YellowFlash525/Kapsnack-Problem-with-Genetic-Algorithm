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

var addElementToDOM = () => {
  _.forEach(config.items, (item) => {
    $('#items_list').append(`
      <tr>
        <td>${item.name}</td>
        <td>${item.weight}</td>
        <td>${item.cost}</td>
        <td>${item.bound}</td>
      </tr>
    `);
  });
}

var initDOMElement = () => {
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
	var message = new Object();
	message.act = "init";
  message.data = config;

  console.log(message.data);
}