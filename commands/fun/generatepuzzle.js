const mongoose = require('mongoose');

module.exports = {
    name: 'generatepuzzle',
    description: 'Generates a random Python programming puzzle and stores it in the database.',
    usage: '+generatepuzzle',
    async execute(client, message, args) {
        // Connect to the Mongoose database

        // Create a new puzzle model
        const Puzzle =require("./fundb/puzzle.js")

        // Get a list of puzzles and solutions from an external library or API
        const puzzles = [
            {
                puzzle: 'Write a function that takes a list of integers and returns the sum of the positive integers.',
                solution: '```python\ndef sum_of_positives(numbers):\n    return sum(x for x in numbers if x > 0)```',
                id:0
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns a new list with all the strings in upper case.',
                solution: '```python\ndef to_upper_case(strings):\n    return [s.upper() for s in strings]```',
                id:1
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns a new list with only the strings that start with the letter "a".',
                solution: '```python\ndef filter_a_strings(strings):\n    return [s for s in strings if s[0] == "a"]```',
                id:2
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the second largest number in the list.',
                solution: '```python\ndef second_largest(numbers):\n    numbers.sort()\n    return numbers[-2]```',
                id:3
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns True if the list is sorted in ascending order, False otherwise.',
                solution: '```python\ndef is_sorted(numbers):\n    return all(x <= y for x, y in zip(numbers, numbers[1:]))```',
                id:4
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns a dictionary with the count of each string in the list.',
                solution: '```python\ndef count_strings(strings):\n    counts = {}\n    for s in strings:\n        if s in counts:\n            counts[s] += 1\n        else:\n            counts[s] = 1\n    return counts```',
                id:5
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns a new list with the integers squared.',
                solution: '```python\ndef square_list(numbers):\n    return [x ** 2 for x in numbers]```',
                id:6
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the sum of the even numbers in the list.',
                solution: '```python\ndef sum_of_evens(numbers):\n return sum(x for x in numbers if x % 2 == 0)```',
                id:7
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns the longest string in the list.',
                solution: '```python\ndef longest_string(strings):\n return max(strings, key=len)```',
                id:8
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns a new list with the integers in reverse order.',
                solution: '```python\ndef reverse_list(numbers):\n return numbers[::-1]```',
                id:9
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the sum of the numbers that are multiples of 3.',
                solution: '```python\ndef sum_of_multiples_of_3(numbers):\n return sum(x for x in numbers if x % 3 == 0)```',
                id:10
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns a new list with only the odd numbers.',
                solution: '```python\ndef filter_odds(numbers):\n return [x for x in numbers if x % 2 == 1]```',
                id:11
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns a new list with the strings sorted alphabetically.',
                solution: '```python\ndef sort_strings(strings):\n return sorted(strings)```',
                id:12
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns True if the list contains a duplicate element, False otherwise.',
                solution: '```python\ndef has_duplicates(numbers):\n return len(numbers) != len(set(numbers))```',
                id:13
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the smallest number in the list.',
                solution: '```python\ndef smallest(numbers):\n return min(numbers)```s',
                id:14
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the average of the numbers in the list.',
                solution: '```python\ndef average(numbers):\n return sum(numbers) / len(numbers)```',
                id:15
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns the product of the numbers in the list.',
                solution: '```python\ndef product(numbers):\n result = 1\n for x in numbers:\n result *= x\n return result```',
                id:16
            },
            {
                puzzle: 'Write a function that takes a list of strings and returns a new list with the strings sorted by length.',
                solution: '```python\ndef sort_by_length(strings):\n return sorted(strings, key=len)```',
                id:17
            },
            {
                puzzle: 'Write a function that takes a list of integers and returns a new list with the even numbers removed.',
                solution: '```python\ndef filter_evens(numbers):\n return [x for x in numbers if x % 2 == 1]```',
                id:18
            },
        ];
        

        // Select a random puzzle from the list
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        const randomPuzzle = puzzles[randomIndex];

        // Check if the puzzle already exists in the database
        const existingPuzzle = await Puzzle.findOne({ puzzle: randomPuzzle.puzzle });
        if (existingPuzzle) {
            return message.channel.send(`Your puzzle is puzzle id number: ${randomPuzzle.id} and the puzzle is: ${randomPuzzle.puzzle}.`);
        }

        // Create a new puzzle document
        const newPuzzle = new Puzzle({
            puzzle: randomPuzzle.puzzle,
            solution: randomPuzzle.solution,
            id: randomPuzzle.id
        });

        // Save the puzzle to the database
        try {
            await newPuzzle.save();
            return message.channel.send(`Successfully generated and stored a new puzzle: "${randomPuzzle.puzzle}. To view the solution type +puzzlesolu ${randomPuzzle.id}"`);
        } catch (error) {
            console.error(error);
            return message.channel.send("An error occurred while trying to save the puzzle to the database!");
        }
    },
};
