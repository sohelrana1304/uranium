const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

/*
3. Write a POST api that creates a book from the details in the request body. The api takes both the author and publisher from the request body. 

    In this api, you have to write a logic that validates the following :

    a)  The authorId is present in the request body. If absent send an error message that this detail is required

    b)  If present, make sure the authorId is a valid ObjectId in the author collection. If not then send an error message that the author is not present.

    c)  The publisherId is present in the request body. If absent send an error message that this detail is required

    d) If present, make sure the publisherId is a valid ObjectId in the publisher collection. If not then send an error message that the publisher is not present.  */

const bookSchema = new mongoose.Schema( {
    name: String,
    author_id: {
        type: ObjectId,
        ref: "newAuthor"
    },
    price: Number,
    ratings: Number,
    publisher: {
        type: ObjectId,
        ref: "newPublisher"
    },
    isHardCover: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


module.exports = mongoose.model('newBookData', bookSchema)
