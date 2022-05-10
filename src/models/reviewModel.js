const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

// Review model
const reviewSchema = new mongoose.Schema({

        bookId: {type: ObjectId, ref: 'Book', required: true, trim: true},

        reviewedBy: {type: String, default: "Guest", required: true, trim: true},

        reviewedAt: {type: Date, required: true, trim: true},

        rating: {type: Number, required: true, trim: true},

        review: {type: String, trim: true},
        
        isDeleted: {type: Boolean, default: false},

}, { timestamps: true })


module.exports = mongoose.model("review", reviewSchema) // reviews