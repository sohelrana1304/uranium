const res = require("express/lib/response")
const authorModel = require("../models/authorModel")
const bookModel = require("../models/bookModel")
const publisherModel = require("../models/publisherModel")


/*
3. Write a POST api that creates a book from the details in the request body. The api takes both the author and publisher from the request body. 

    In this api, you have to write a logic that validates the following :

    a)  The authorId is present in the request body. If absent send an error message that this detail is required

    b)  If present, make sure the authorId is a valid ObjectId in the author collection. If not then send an error message that the author is not present.

    c)  The publisherId is present in the request body. If absent send an error message that this detail is required

    d) If present, make sure the publisherId is a valid ObjectId in the publisher collection. If not then send an error message that the publisher is not present.  */

const createBook = async function (req, res) {

    let book = req.body

    if (book.author_id && book.publisher) {
        let authorValid = await authorModel.findById({ _id: book.author_id })//.select("_id")
        let publisherValid = await publisherModel.findById({ _id: book.publisher })//.select("_id")
        if (!authorValid && !publisherValid) {
            res.send({ msg: 'author_id & publisher id is invalid, kindly provide valid id' })
        } else if (!authorValid && publisherValid) {
            res.send({ msg: 'author_id is invalid, kindly provide valid author_id' })
        } else if (authorValid && !publisherValid) {
            res.send({ msg: 'publisher id is invalid, kindly provide valid publisher id' })
        } else {
            // if (!await bookModel.exists(book)) {
            let bookCreated = await bookModel.create(book)
            res.send({ msg: bookCreated })
            // }
        }
    } else if (!book.author_id && book.publisher) res.send({ msg: 'author_id is not present' })
    else if (book.author_id && !book.publisher) res.send({ msg: 'publisher id is not present' })
    else res.send({ msg: 'author_id & publisher id is not present' })
}


// 4. Write a GET api that fetches all the books along with their author details (you have to populate for this) as well the publisher details (you have to populate for this) 

const getAllBooks = async function (req, res) {
    let books = await bookModel.find().populate(['author_id', 'publisher'])
    res.send({ data: books })
}


/*
5. Create at least 4 publishers (Penguin, Bloomsbury, Saraswati House, HarperCollins). Create at least 6 authors with ratings 2, 3, 3.5, 4, 4.5 and 5. Create around 10 books with these publishers and authors.
Create a new PUT api /books and perform the following two operations

    a) Add a new boolean attribute in the book schema called isHardCover with a default false value. For the books published by 'Penguin' and 'HarperCollins', update this key to true.    */


const updateBooks = async function (req, res) {
    let updateCover = await bookModel.updateMany({ publisher: '625ae73f6b0dc6fc7cd45b23' }, { $set: { isHardCover: true } }, { new: true, upsert: true })

    let updateCover2 = await bookModel.updateMany({ publisher: '625ae7e36b0dc6fc7cd45b29' }, { $set: { isHardCover: true } }, { new: true, upsert: true })

    res.send({ msg: updateCover, updateCover2 })
    
    // if (updateCover && updateCover2){
    //     return res.send({ msg: updateCover, updateCover2 })
    // } 

    // let updatePrice = await bookModel.updateMany({ ratings: { $gt: 3.5 } }, { $inc: { "price": 10 } }, { new: true, upsert: true })

    // if (updatePrice){
    //     return res.send({ msg: updatePrice })
    // }

}

/*
5. Create at least 4 publishers (Penguin, Bloomsbury, Saraswati House, HarperCollins). Create at least 6 authors with ratings 2, 3, 3.5, 4, 4.5 and 5. Create around 10 books with these publishers and authors.
Create a new PUT api /books and perform the following two operations

    b) For the books written by authors having a rating greater than 3.5, update the books price by 10 (For eg if old price for such a book is 50, new will be 60) */


const updateBooksPrice = async function (req, res) {

    let updatePrice = await bookModel.updateMany({ ratings: { $gt: 3.5 } }, { $inc: { "price": 10 } }, { new: true, upsert: true })

    res.send({ msg: updatePrice })
}



const getBooksData = async function (req, res) {
    let books = await bookModel.find()
    res.send({ data: books })
}

const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id')
    res.send({ data: specificBook })

}



module.exports.createBook = createBook
module.exports.getAllBooks = getAllBooks
module.exports.updateBooks = updateBooks
module.exports.updateBooksPrice = updateBooksPrice


module.exports.getBooksData = getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails


