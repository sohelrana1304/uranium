const mongoose = require('mongoose');

// 2. Write a POST api that creates a publisher from the details in the request body

const publisherSchema = new mongoose.Schema( {
    publisher_name: String,
    headQuarter: String

}, { timestamps: true });

module.exports = mongoose.model('newPublisher', publisherSchema)