const { find } = require("../models/bookModel")
const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const userModel = require("../models/userModel")
const validator = require("../validator/validator")

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
            return res.status(400).send({ status: false, msg: "Please enter release date" })
        }

        let uniqueTitle = await bookModel.findOne({ title: title })
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: "Title is already exist, try new title" })
        }

        let uniqueUserId = await userModel.findById({ _id: userId }) // question?
        console.log(uniqueUserId)
        if (!uniqueUserId) {
            return res.status(400).send({ status: false, message: "UserId is not exist in our data base" })
        }

        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, message: "ISBN is already exist, input new ISBN" })
        }

        let createBook = await bookModel.create(data)
        return res.status(201).send({ status: false, message: "A new book has been created successfully", createBook })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


// To get the book details
const getBook = async function (req, res) {
    try {

        let data = req.query
        let searchFilter = [{ userId: data.userId }, { category: data.category }, { subcategory: data.subcategory }]

        if (!Object.keys(req.query).length) {
            let books = await bookModel.find({ isDeleted: false })//.populate('authorId')
            return res.status(200).send({ status: false, books })
        }

        let findBooks = await bookModel.find({ $or: searchFilter, isDeleted: false })
            .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1 }).sort({ "title": 1 })

        if (findBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        return res.status(201).send({ status: true, message: "Book fetched successfully", data: findBooks })


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let findBook = await bookModel.findById({ _id: bookId });//.select({__v: 0})
        // console.log(findBook)
        if (!findBook) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        let findReviewsData = await reviewModel.find({ bookId: bookId }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        console.log(findReviewsData)

        return res.status(201).send({
            status: true,
            message: "Book list",
            data: {
                "_id": findBook._id,
                "title": findBook.title,
                "excerpt": findBook.excerpt,
                "userId": findBook.userId,
                "category": findBook.category,
                "subcategory": findBook.subcategory,
                "deleted": findBook.isDeleted,
                "reviews": findBook.reviews,
                "deletedAt": findBook.deletedAt,
                "releasedAt": findBook.releasedAt,
                "createdAt": findBook.createdAt,
                "updatedAt": findBook.updatedAt,
                "reviewsData": findReviewsData,
            }

        })



        // let findReviews = await bookModel.find({_id: findBook._id, isDeleted: false}).select({reviews: 1})
        // let findReviews = await bookModel.find({ reviews: findBook.reviews, isDeleted: false }).select({ reviews: 1, _id: 0 })
        // console.log(findReviews)
        // if (findBook.reviews.length == 0) {
        //     return res.status(201).send({
        //         status: true,
        //         message: "Book list",
        //         data: {
        //             "_id": findBook._id,
        //             "title": findBook.title,
        //             "excerpt": findBook.excerpt,
        //             "userId": findBook.userId,
        //             "category": findBook.category,
        //             "subcategory": findBook.subcategory,
        //             "deleted": findBook.isDeleted,
        //             "reviews": findBook.reviews,
        //             "deletedAt": findBook.deletedAt,
        //             "releasedAt": findBook.releasedAt,
        //             "createdAt": findBook.createdAt,
        //             "updatedAt": findBook.updatedAt,
        //             "reviewsData": findReviews,
        //         }

        //     })
        // }

        // let findReviews = await reviewModel.find({reviews: findBook.reviews})
        // console.log(findReviews)
        // return res.status(201).send({status: true, message:"Books list", findBook})

        // findBook = JSON.parse(JSON.stringify(findBook.reviews))
        // console.log(findBook)
        // findBook = Object.keys(findBook.reviews)
        // console.log(findBook)

        // return res.status(201).send({
        //     status: true,
        //     message: "Book list",
        //     data: findBook,
        //     // "reviews": findReviews
        // })


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById = getBookById