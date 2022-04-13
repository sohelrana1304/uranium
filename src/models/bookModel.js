const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema( {
    bookName: {
        type: String,
        unique: true,
        required: true,
    }, 
    authorName: String, 
    stockAvailable: Boolean,
    prices: {
        indianPrice: String,
        europePrice: String,
    },
    year: Number,
    // sales: {type: Number, default: 10},
    totalPages: Number,
    tags: [String],
}, { timestamps: true });


module.exports = mongoose.model('Book', bookSchema) //users

//Validation:
//require:true
//unique
// default

//String
//Number
//Date
//Boolean
// Arrays
// Object
// ObjectId
// Buffer - not cover
