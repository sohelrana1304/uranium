const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const ObjectId = mongoose.Schema.Types.ObjectId

const developerSchema = new mongoose.Schema( {
    name: String,
    gender: {
        type: String,
        enum: ["male", "female", "others"]
    },
    percentage: Number,
    batch: {
        type: ObjectId,
        ref: "Batch"
    }

}, { timestamps: true });


module.exports = mongoose.model('Developer', developerSchema)
