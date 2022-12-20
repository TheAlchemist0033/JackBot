const mongoose = require("mongoose");
puzzleSchema =  mongoose.Schema({
    puzzle: String,
    solution: String,
    id: Number
});
const Puzzle = mongoose.model('Puzzle', puzzleSchema);
module.exports = Puzzle;
