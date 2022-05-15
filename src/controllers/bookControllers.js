const { find } = require("../models/bookModel")
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const userModel = require("../models/userModel")
const validator = require("../validator/validator")
const mongoose = require('mongoose')

// To create a book
const createBook = async function (req, res) {
    try {
        const data = req.body
        // Checking input from req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, msg: "Bad Request, No Data Provided" })
        };

        const { title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt } = data

        // Title is mandatory
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please enter title" })
        }
        // excerpt is mandatory
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please write excerpt" })
        }
        // userId is mandatory
        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter userId" })
        }
        // Checking the inputted userId valid or not
        if (!validator.isValidObjectId(userId)) {
            return res.status(404).send({ status: false, message: "User id is not valid" })
        }
        // ISBN is mandatory
        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please enter ISBN" })
        }
        // category is mandatory
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, msg: "Please enter category" })
        }
        // subcategory is mandatory
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please enter subcategory" })
        }
        // releasedAt is mandatory
        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Please enter released date" })
        }

        // Checking inputted title from db for uniqueness
        let uniqueTitle = await bookModel.findOne({ title: title })
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: "Title is already exist, try new title" })
        }

        // Finding the inputted userId's existance from db
        let uniqueUserId = await userModel.findById({ _id: userId })
        if (!uniqueUserId) {
            return res.status(404).send({ status: false, message: "UserId is not exist in our data base" })
        }

        // Checking inputted ISBN from db for uniqueness
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already exist, input new ISBN" })
        }

        // Date format("YYYY-MM-DD") validation
        let dateRgx = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        if (!dateRgx.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Please provide valid date format YYYY-MM-DD" });
        }

        // Creating a new book
        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "A new book has been created successfully", createBook })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


// To get the book details
const getBook = async function (req, res) {
    try {
        // Taking data from query
        let data = req.query

        // Checking the inputed userId valid or not
        if (data.userId) {
            if (!validator.isValidObjectId(data.userId)) {
                return res.status(404).send({ status: false, message: "User id is not valid" })
            }
        }

        // Finding books with inputted data from query and selecting required fields and sorting those books in Alphabatical order
        let findBooks = await bookModel.find(data, { isDeleted: false })
            .select({ subcategory: 0, ISBN: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ "title": 1 })
        // Checking the length of finded books
        if (findBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No book found" })
        }
        // Sending response
        return res.status(200).send({ status: true, message: "Book list", data: findBooks })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

// To get book by bookId
const getBookById = async function (req, res) {
    try {
        // Taking input from params
        let bookId = req.params.bookId
        // Checking inputted book id is valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Book id is not valid" })
        }

        // Finding the book with given book id from db
        let findBook = await bookModel.findById({ _id: bookId }).select({ISBN: 0, __v: 0}).lean()
        // console.log(findBook)
        if (!findBook) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        // Finding reviews from db and selecting required fields
        let findReviewsData = await reviewModel.find({ bookId: bookId })
            .select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1, })
        // console.log(findReviewsData)

        // Adding a new key in findbook document only for response
        findBook.reviewsData = findReviewsData

        return res.status(200).send({ status: true, message: "Book list", data: findBook })

        // Sending response according to project requirement
        // return res.status(200).send({
        //     status: true,
        //     message: "Book list",
        //     data: {
        //         "_id": findBook._id,
        //         "title": findBook.title,
        //         "excerpt": findBook.excerpt,
        //         "userId": findBook.userId,
        //         "category": findBook.category,
        //         "subcategory": findBook.subcategory,
        //         "deleted": findBook.isDeleted,
        //         "reviews": findBook.reviews,
        //         "deletedAt": findBook.deletedAt,
        //         "releasedAt": findBook.releasedAt,
        //         "createdAt": findBook.createdAt,
        //         "updatedAt": findBook.updatedAt,
        //         "reviewsData": findReviewsData,
        //     }

        // })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

// Update book
const updateBook = async function (req, res) {
    try {
        // Taking data from prams
        let bookId = req.params.bookId

        // Checking inputted book id is valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Book id is not valid" })
        }

        // Finding the book with given book id from db
        let uniqueBlogId = await bookModel.findOne({ _id: bookId })
        if (!uniqueBlogId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        // If blog's isDeleted atribute is true then it will not update the blog
        if (uniqueBlogId.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book is already deleted" })
        }

        // Taking data from request body for updation
        let data = req.body
        const { title, excerpt, ISBN, releasedAt } = data

        // Checking request body for empty
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "Nothing to update, please provide some updation details" })
        }

        // let bookKeys = ["title", "excerpt", "releasedAt", "ISBN"]
        // for (let i = 0; i < Object.keys(req.body).length; i++) {
        //     let keyPresent = bookKeys.includes(Object.keys(req.body)[i])
        //     if (!keyPresent) {
        //         return res.status(400).send({ status: false, message: "Wrong Key present" })
        //     }
        // }

        // If title key is present in request body but no data provided, it will ask to input data
        if (Object.keys(req.body).includes('title')) {
            if (!validator.isValid(req.body.title)) {
                return res.status(400).send({ status: false, message: "title key can't be empty" })
            }
            // Checking title to avoide duplicasy
            const duplicateTitle = await bookModel.findOne({ title: req.body.title })
            if (duplicateTitle)
                return res.status(400).send({ status: false, message: "Title is already present" })
        }
        // If excerpt key is present in request body but no data provided, it will ask to input data
        if (Object.keys(req.body).includes('excerpt')) {
            if (!validator.isValid(req.body.excerpt)) {
                return res.status(400).send({ status: false, message: "excerpt key can't be empty" })
            }
        }
        // If releasedAt key is present in request body but no data provided, it will ask to input data
        if (Object.keys(req.body).includes('releasedAt')) {
            if (!validator.isValid(req.body.releasedAt)) {
                return res.status(400).send({ status: false, message: "releasedAt key can't be empty" })
            }
        }
        // If ISBN key is present in request body but no data provided, it will ask to input data
        if (Object.keys(req.body).includes('ISBN')) {
            if (!validator.isValid(req.body.ISBN)) {
                return res.status(400).send({ status: false, message: "ISBN Is Required" })
            }
            // Checking ISBN to avoide duplicasy
            let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
            if (uniqueISBN) {
                return res.status(400).send({ status: false, message: "ISBN is already exist, input new ISBN" })
            }
        }

        // Updating that book document according to input
        let updateBook = await bookModel.findByIdAndUpdate({ _id: bookId },
            { $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } }, { new: true })

        res.status(200).send({ status: true, message: "Book has been updated successfully", updateBook })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const deletedBook = async function (req, res) {
    try {
        // Taking data from prams
        let bookId = req.params.bookId
        // Checking inputted book id is valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(404).send({ status: false, message: "Book id is not valid" })
        }

        // Finding the book with given book id from db
        let uniqueBlogId = await bookModel.findOne({ _id: bookId })
        if (!uniqueBlogId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        // If blog's isDeleted atribute is true then it will not delete the blog again
        if (uniqueBlogId.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book is already deleted" })
        }

        // Deleting that book document and adding time stamp of when the document is deleting
        let deleteBook = await bookModel.findByIdAndUpdate({ _id: bookId },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, message: "Book has been deleted successfully" })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById = getBookById
module.exports.updateBook = updateBook
module.exports.deletedBook = deletedBook