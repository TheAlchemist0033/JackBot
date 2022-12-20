const mongoose = require('mongoose');

module.exports = {
    name: 'puzzlesolu',
    description: 'Gets the solution for a puzzle from the database given the puzzle ID.',
    usage: '+puzzlesolu <puzzle_id>',
    async execute(client, message, args) {
        // Connect to the Mongoose database
        const Puzzle = require("./fundb/puzzle.js")

        // Check if a puzzle ID was provided
        if (args.length < 1) {
            return message.channel.send("You need to specify a puzzle ID!");
        }

        // Get the puzzle ID
        const puzzleId = args[0];
        console.log(args[0])

        // Find the puzzle with the specified ID
        const puzzle = await Puzzle.findOne({ id: puzzleId });
        if (!puzzle) {
            return message.channel.send("Could not find a puzzle with the specified ID!");
        }

        // Send the solution to the channel
        return message.channel.send(`Solution for puzzle "${puzzle.puzzle}":\n${puzzle.solution}`);
    },
};
