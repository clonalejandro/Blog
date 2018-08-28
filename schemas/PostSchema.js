/** IMPORTS **/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    postId: Number,
    url: String,
    title: String,
    content: String,
    thumb: String,
    description: String,
    date: Date,
    author: String,
    tags: Array
});
    

module.exports = mongoose.model('Post', PostSchema);