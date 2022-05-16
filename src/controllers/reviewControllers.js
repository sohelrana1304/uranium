const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const validator = require("../validator/validator")

// To create a review
const postReview = async function (req, res) {
    try {
        // Taking input from path params
        let bookId = req.params.bookId

        // Checking the inputtes bookId valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }

        // Finding that bookId from existing db
        let checkBookId = await bookModel.findById({ _id: bookId }).select({ISBN: 0, __v: 0})
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "No book found" })
        }

        // Checking the book document for true
        if (checkBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is not available to giva a review" })
        }

        // Taking data from request body
        let data = req.body
        // Checking the request body for empty 
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "Bad request, Kindly add some data to post a review" })
        }
        const { reviewedBy, rating, review } = data

        // If reviewdBy key is present in request body but no data provided, then it will take "Guest" as default
        if (Object.keys(data).includes('reviewedBy')) {
            if (!validator.isValid(data.reviewedBy)) {
                data.reviewedBy = "Guest"
            }
        }
        // Rating must be present in request body
        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "Please give ratings" })
        }
        // Setting rating limit between 1-5.
        if (!(rating >= 1 && rating <= 5)) {
            return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
        }
        // If review key is present in request body but no data provided, it will ask to input data
        if (Object.keys(data).includes('review')) {
            if (!validator.isValid(data.review)) {
                return res.status(400).send({ status: false, message: "review key can't be empty" })
            }
        }

        data.bookId = checkBookId._id;

        // Every time a new review document will be created, new Date() automatically will be added in reviewedAt key
        data.reviewedAt = new Date() 

        // Creating a new review
        let createReview = await reviewModel.create(data)
        // console.log(createReview)

        // Updating the review count for the inputted bookId's document
        if (createReview) {
            let updateReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } },
                { new: true})
        }

        // From the newly created review's document, deselecting not necessary things
        let responseReview = await reviewModel.findOne({ _id: createReview }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        // console.log(responseReview)

        // Finding that bookId from existing db for showing the updated document
        let getBookDocument = await bookModel.findById({ _id: bookId }).select({ISBN: 0, __v: 0}).lean()
        
        // Adding a new key in finded book document
        getBookDocument.reviewsData = responseReview

        // Giving response with the book document along with the newly created review
        return res.status(201).send({
            status: true,
            message: "Review is added successfully",
            data: getBookDocument
        })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


// To update a review
const updateReview = async function (req, res) {
    try {
        // Taking inputs for both bookId and reviewId from path params
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        // Checking the inputtes bookId valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }
        // Checking the inputtes reviewId valid or not
        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Review id is not valid" })
        }

        // Finding that bookId from existing db
        let findBookId = await bookModel.findById({ _id: bookId }).select({ISBN: 0, __v: 0}).lean()
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        // Finding that reviewId from existing db
        let findReviewId = await reviewModel.findById({ _id: reviewId })
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        // Checking the book document for true
        if (findBookId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is not available to update a review" })
        }
        // Checking the review document for isDeleted attribute is to be true
        if (findReviewId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Review is not available to update" })
        }

        // Checking the book document for review count
        if (findBookId.reviews == 0) {
            return res.status(404).send({ status: false, message: "Book does not have any review" })
        }

        // If the bookId not founded in the review document then it does't update the review
        let sameDoc = await reviewModel.findOne({_id: reviewId},{bookId: bookId}).select({bookId: 1})
        let getBookId = sameDoc.bookId.toString()
        // console.log(getBookId)
        if(getBookId !== bookId){
            return res.status(404).send({status: false, message:"Review id is not associate with the book id"})
        }
        // console.log(sameDoc)

        // Taking data from request body
        let data = req.body
        // Checking the request body for empty 
        if (Object.keys(data) == 0) {
            return res.status(400).send({ status: false, message: "Bad request, no data found" })
        }

        const { reviewedBy, rating, review } = data

        // If reviewdBy key is present in request body but no data provided, it will ask to input data
        if (Object.keys(data).includes('reviewedBy')) {
            if (!validator.isValid(data.reviewedBy)) {
                return res.status(400).send({ status: false, message: "Reviewer's name can't be empty" })
            }
        }
        // If rating key is present in request body but no data provided, it will ask to input data
        if (Object.keys(data).includes('rating')) {
            if (!validator.isValid(data.rating)) {
                return res.status(400).send({ status: false, message: "Rating is required" })
            }
            // Setting rating limit between 1-5
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
            }
        }
        // If review key is present in request body but no data provided, it will ask to input data
        if (Object.keys(data).includes('review')) {
            if (!validator.isValid(data.review)) {
                return res.status(400).send({ status: false, message: "Write some review for updation" })
            }
        }

        // Updating the review document, taking data from request body
        let updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId },
            { $set: { reviewedBy: reviewedBy, rating: rating, review: review } }, { new: true })
            .select({ createdAt: 0, updatedAt: 0, isDeleted: 0, __v: 0 })

        // Adding a new key in finded book document
        findBookId.reviewsData = updateReview

        // Giving response with the book document along with the updated review
        return res.status(200).send({
            status: true,
            message: "Review has been updated successfully",
            data: findBookId
        })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


// To delete a review
const deleteReview = async function (req, res) {
    try {
        // Taking inputs for both bookId and reviewId from path params
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        // Checking the inputtes bookId valid or not
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Book id is not valid" })
        }
        // Checking the inputtes reviewId valid or not
        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Review id is not valid" })
        }

        // Finding that bookId from existing db
        let findBookId = await bookModel.findById({ _id: bookId })
        if (!findBookId) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        // Finding that reviewId from existing db
        let findReviewId = await reviewModel.findById({ _id: reviewId })
        if (!findReviewId) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        // Checking the book document for review count
        if (findBookId.reviews == 0) {
            return res.status(404).send({ status: false, message: "Book does not have any review" })
        }
        // Checking the review document for isDeleted attribute is to be true
        if (findReviewId.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Review is already deleted" })
        }

        // If the bookId not founded in the review document then it does't update the review
        let sameDoc = await reviewModel.findOne({_id: reviewId},{bookId: bookId}).select({bookId: 1})
        let getBookId = sameDoc.bookId.toString()
        // console.log(getBookId)
        if(getBookId !== bookId){
            return res.status(404).send({status: false, message:"Review id is not associate with the book id"})
        }
        // console.log(sameDoc)

        // Deleting that review document
        let deleteReview = await reviewModel.findByIdAndUpdate({ _id: reviewId },
            { $set: { isDeleted: true } }, { new: true })

        // Updating review count after deletation of review    
        let decreaseReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } },
            { new: true})

        // In response giving deletation message
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