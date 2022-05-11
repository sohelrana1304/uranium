const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

// Book model
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },

    excerpt: { type: String, required: true, trim: true },

    userId: { type: ObjectId, ref: "User", required: true, trim: true }, // Referring to the User collection

    ISBN: { type: String, required: true, trim: true },

    category: { type: String, required: true, trim: true },

    subcategory: { type: [String], required: true, trim: true },

    reviews: { type: Number, default: 0, trim: true },

    deletedAt: { type: Date, trim: true },

    isDeleted: { type: Boolean, default: false, trim: true },

    releasedAt: { type: Date, required: true, trim: true }

    // releasedAt: { type: Date, required: [true, "Date is required"], trim: true }

}, { timestamps: true })


module.exports = mongoose.model("Book", bookSchema) // books