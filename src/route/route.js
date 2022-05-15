const express = require('express')
const router = express.Router();
const userController = require("../controllers/userControllers")
const bookController = require("../controllers/bookControllers")
const reviewController = require("../controllers/reviewControllers")
const MW = require("../middleware/middleware")

// User API
// To rgistar a user
router.post("/register", userController.createUser)
// Login for a user
router.post("/login", userController.userLogin)

// Book API
// To create a new book
router.post("/books", MW.authentication, MW.authorization, bookController.createBook)
// To get all the books data
router.get("/books", MW.authentication, bookController.getBook)
// To get books with reviews
router.get("/books/:bookId", MW.authentication, bookController.getBookById)
// To update a book by bookId
router.put("/books/:bookId", MW.authentication, MW.authorization, bookController.updateBook)
// To delete a book by bookId
router.delete("/books/:bookId", MW.authentication, MW.authorization, bookController.deletedBook)

// Review API
// To post a review
router.post("/books/:bookId/review", reviewController.postReview)
// To update a review
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
// To delete a review
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


module.exports = router;