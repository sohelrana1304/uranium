const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validator/validator")
// const mongoose = require('mongoose')


const postReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }

        let checkBookId = await bookModel.findById({ _id: bookId })
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }

        if (checkBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is not available to giva a review" })
        }

        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "Bad request, no data found" })
        }
        const { reviewedBy, rating, review } = data

        if (validator.isValid(reviewedBy)) {
            // return res.status(400).send({ status: false, message: "Please enter reviewr name" })
            return data.reviewedBy = "Guest"

        }




        // if (!reviewedBy){
        //     return data.reviewedBy = "Guest"
        // }

        // if (!validator.isValid(reviewedAt)) {
        //     return res.status(400).send({ status: false, message: "Please enter review date" })
        // }

        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "Please give ratings" })
        }

        //setting rating limit between 1-5.
        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
        }

        data.bookId = checkBookId._id;
        data.reviewedAt = new Date()

        let createReview = await reviewModel.create(data)
        // console.log(createReview)

        if (createReview) {
            let updateReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } },
                { new: true, upsert: true })
        }

        let responseReview = await reviewModel.findOne({ _id: createReview }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        // console.log(responseReview)

        return res.status(201).send({
            status: true,
            message: "Review is added successfully",
            data: responseReview
        })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }

        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Review id is not valid" })
        }

        let findBookId = await bookModel.findById({ _id: bookId }).lean()
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        let findReviewId = await reviewModel.findById({ _id: reviewId })
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        if (findBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is not available to update a review" })
        }

        if (findReviewId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Review is not available to update" })
        }

        if (findBookId.reviews == 0) {
            return res.status(404).send({ status: false, message: "Book does not have any review" })
        }

        let data = req.body
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "Bad request, no data found" })
        }
        const { reviewedBy, rating, review } = data

        if (rating) {
            //setting rating limit between 1-5.
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
            }
        }

        let updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId },
            { $set: { reviewedBy: reviewedBy, rating: rating, review: review } }, { new: true }).select({createdAt: 0, updatedAt: 0, __v: 0})


        findBookId.updateReview = updateReview
    
        return res.status(200).send({
            status: true,
            message: "Review has been updated successfully",
            // data: updateReview
            data: findBookId
        })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }

        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Review id is not valid" })
        }

        let findBookId = await bookModel.findById({ _id: bookId })
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        let findReviewId = await reviewModel.findById({ _id: reviewId })
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        if (findBookId.reviews == 0) {
            return res.status(404).send({ status: false, message: "Book does not have any review" })
        }
        
        if (findReviewId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Review is already deleted" })
        }

        let deleteReview = await reviewModel.findByIdAndUpdate({_id: reviewId},
            {$set: {isDeleted: true}}, {new: true})

        let decreaseReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } },
            { new: true, upsert: true })

        return res.status(200).send({ status: true, message: "Review has been deleted successfully" })    

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.postReview = postReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview