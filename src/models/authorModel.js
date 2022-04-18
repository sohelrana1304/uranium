const mongoose = require('mongoose');

// 1. Write a POST api that creates an author from the details in request body

const authorSchema = new mongoose.Schema( {
    author_name: String,
    age:Number,
    address:String,
    ratings:Number

}, { timestamps: true });

module.exports = mongoose.model('newAuthor', authorSchema)
