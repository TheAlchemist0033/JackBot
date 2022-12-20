const mongoose = require("mongoose");
cveSchema = new mongoose.Schema({
    id: String,
    count: Number,
    lastUpdated: Date,
});
const Cve = mongoose.model('Cve', cveSchema);
module.exports = Cve;
