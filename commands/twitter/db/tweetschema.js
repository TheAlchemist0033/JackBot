const mongoose = require("mongoose");
tweetSchema = new mongoose.Schema({
    tweetId: {
        type: String,
        required: true
    },
    cves: [{
        type: String,
        required: true
    }],
    cveCounts: {
        type: Map,
        of: Number
    }
});
const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;