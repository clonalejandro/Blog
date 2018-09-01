/** IMPORTS **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FeedSchema = new Schema({
    email: String
});


module.exports = mongoose.model('Feed', FeedSchema);