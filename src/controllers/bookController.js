const { count } = require("console")
const BookModel = require("../models/bookModel")
const AuthorModel = require("../models/authorModel")

//  Assignment --------------

// 1. Write create APIs for both books and authors ---> If author_id is not available then do not accept the entry(in neither the author collection nor the books collection)

const createNewAuthor = async function (req, res) {
    let data = req.body
    let saveData = await AuthorModel.create(data)
    res.send({ msg: saveData })
}


const createNewBook = async function (req, res) {
    let newBook = req.body
    let saveData = await BookModel.create(newBook)
    res.send({ msg: saveData })
}


// 2. List out the books written by "Chetan Bhagat" ( this will need 2 DB queries one after another- first query will find the author_id for "Chetan Bhagat”. Then next query will get the list of books with that author_id )

const bookList = async function (req, res) {
    let authorName = await AuthorModel.find({ author_name: "Chetan Bhagat" })
    let id = authorName[0].author_id
    let saveData = await BookModel.find({ author_id: id }).select({ book_name: 1 })
    res.send({ msg: saveData })
}


// 3. find the author of “Two states” and update the book price to 100;  Send back the author_name and updated price in response.  ( This will also need 2  queries- 1st will be a findOneAndUpdate. The second will be a find query aith author_id from previous query)

const updatedBookPrice = async function (req, res) {
    let bookDetails = await BookModel.find({ bookName: "Two states" })
    let id = bookDetails[0].author_id
    let authorName = await AuthorModel.find({ author_id: id }).select({ author_name: 1, _id: 0 })

    let bookName = bookDetails[0].book_Name
    let updateNewPrice = await BookModel.findOneAndUpdate({ book_Name: bookName }, { price: 100 }, { new: true }).select({ price: 1, _id: 0 })
    res.send({ msg: authorName, updateNewPrice })
}



// 4. Find the books which costs between 50-100(50,100 inclusive) and respond back with the author names of respective books.

const authorsName = async function (req, res) {
    let booksId = await BookModel.find({ price: { $gte: 50, $lte: 100 } }).select({ author_id: 1, _id: 0 })
    let id = booksId.map(inp => inp.author_id)
    // console.log(id)
    let arr = []
    for (let i = 0; i < id.length; i++) {
        let x = id[i]

        const author = await AuthorModel.find({ author_id: x }).select({ author_name: 1, _id: 0 })
        arr.push(author)
    }
    const authorName = arr.flat()

    res.send({ msg: authorName })
}

//  Assignment  ^^^^


const createBook = async function (req, res) {
    let data = req.body

    let savedData = await BookModel.create(data)
    res.send({ msg: savedData })
}

const getBooksData = async function (req, res) {
    let allBooks = await BookModel.find({ authorName: "HO" })
    console.log(allBooks)
    if (allBooks.length > 0) res.send({ msg: allBooks, condition: true })
    else res.send({ msg: "No books found", condition: false })
}


const updateBooks = async function (req, res) {
    let data = req.body // {sales: "1200"}
    // let allBooks= await BookModel.updateMany( 
    //     { author: "SK"} , //condition
    //     { $set: data } //update in data
    //  )
    let allBooks = await BookModel.findOneAndUpdate(
        { authorName: "ABC" }, //condition
        { $set: data }, //update in data
        { new: true, upsert: true } ,// new: true - will give you back the updated document // Upsert: it finds and updates the document but if the doc is not found(i.e it does not exist) then it creates a new document i.e UPdate Or inSERT
    )

    res.send({ msg: allBooks })
}

const deleteBooks = async function (req, res) {
    // let data = req.body 
    let allBooks = await BookModel.updateMany(
        { authorName: "FI" }, //condition
        { $set: { isDeleted: true } }, //update in data
        { new: true } ,
    )

    res.send({ msg: allBooks })
}

// CRUD OPERATIONS:
// CREATE
// READ
// UPDATE
// DELETE

module.exports.createBook = createBook
module.exports.getBooksData = getBooksData
module.exports.updateBooks = updateBooks
module.exports.deleteBooks = deleteBooks


// Assignmetn ------------------>
module.exports.createNewAuthor = createNewAuthor
module.exports.createNewBook = createNewBook
module.exports.bookList = bookList
module.exports.updatedBookPrice = updatedBookPrice
module.exports.authorsName = authorsName