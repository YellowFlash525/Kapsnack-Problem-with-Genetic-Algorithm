# Kapsnack-Problem-with-Genetic-Algorithm
Implementation of Kapsnack Problem with Genetic Algorithm

Chromosomes
Chromosomes express a potential certificate through an encoding such as binary, values, or trees. For the 0-1 knapsack problem, we will use a binary array to express which items of the knapsack will be added (1's) and which will be omitted (0's).

Genetic Algorithm concept:
-> 1. [Start] Generate random population of n chromosomes (suitable solutions for the problem)
-> 2. [Fitness] Evaluate the fitness f(x) of each chromosome x in the population
-> 3. [New population] Create a new population by repeating following steps until the new population is complete
    -> A. [Selection] Select two parent chromosomes from a population according to their fitness (the better fitness, the bigger chance to be selected)
    -> B. [Crossover] With a crossover probability cross over the parents to form a new offspring (children). If no crossover was performed, offspring is an exact copy of parents.
    -> C. [Mutation] With a mutation probability mutate new offspring at each locus (position in chromosome).
    -> D. [Accepting] Place new offspring in a new population
-> 4. [Replace] Use new generated population for a further run of algorithm
-> 5. [Test] If the end condition is satisfied, stop, and return the best solution in current population
-> 6 [Loop] Go to step 2
