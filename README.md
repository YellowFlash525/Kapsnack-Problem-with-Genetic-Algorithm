# Kapsnack-Problem-with-Genetic-Algorithm
Implementation of Kapsnack Problem with Genetic Algorithm

Na Algorytm genetyczny składa się:
	- Populacja, która jest zbiór osobników o określonej liczebności.
	- W skład populacji wchodzą CHROMOSOMY, które są ciągami genów
		- w przypadku problemu plecakowego genami:
			- nazwa elementu
			- wartość elementu
			- waga elementu
			- ilość sztuk danego zabranego elementu


1. Rozwiązywanie problemu rozpoczynamy od wygenerowania populacji składającej się z chromosomów - generateChromosome()
2. Następnie dla każdego chromosomu przeliczania jest wartość fitness określająca wartość przystosowania tego chromosomu - measureFitness()
3. Sprawdzanie warunku zatrzymania - w tym przypadku jest to liczba iteracji, która musi być równa maksymalnej liczbie generacji maxGen
4. Jeśli warunek nie jest spełniony wykonywana jest selekcja chromosomów i ich krzyżowanie - selectFromPopulation() i crossover1() crossover2()
5. Z wyselekcjonowanych, zkrzyżowanych chromosomów tworzona jest nowa populacja
6. Następnie wyprowadzany jest najlepszy chromosom
