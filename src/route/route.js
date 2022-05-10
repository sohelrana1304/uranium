const express = require('express')
const router = express.Router();
const userController = require("../controllers/userControllers")
const bookController = require("../controllers/bookControllers")
const reviewController = require("../controllers/reviewControllers")

// To rgistar a user
router.post("/register", userController.createUser)
// Login for a user
router.post("/login", userController.userLogin)
// To create a new book
router.post("/books", bookController.createBook)
// To get all the books data
router.get("/books", bookController.getBook)
// To get books with reviews
router.get("/books/:bookId", bookController.getBookById)
// To update a book by bookId
router.put("/books/:bookId", bookController.updateBook)
// To delete a book by bookId
router.delete("/books/:bookId", bookController.deletedBook)



router.post("/books/:bookId/review", reviewController.postReview)




module.exports = router;