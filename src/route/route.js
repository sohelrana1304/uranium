const express = require('express')
const router = express.Router();
const userController = require("../controllers/userControllers")
const bookController = require("../controllers/bookControllers")
const reviewController = require("../controllers/reviewControllers")
const MW = require("../middleware/middleware")

// To rgistar a user
router.post("/register", userController.createUser)
// Login for a user
router.post("/login", userController.userLogin)
// To create a new book
router.post("/books", MW.authentication, MW.authorization, bookController.createBook) // Done
// To get all the books data
router.get("/books", MW.authentication, bookController.getBook) // Done
// To get books with reviews
router.get("/books/:bookId", MW.authentication, bookController.getBookById) // Done
// To update a book by bookId
router.put("/books/:bookId", MW.authentication, MW.authorization, bookController.updateBook) // Done
// To delete a book by bookId
router.delete("/books/:bookId", MW.authentication, MW.authorization, bookController.deletedBook)



router.post("/books/:bookId/review", reviewController.postReview)




module.exports = router;