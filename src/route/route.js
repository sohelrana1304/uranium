const express = require('express')
const router = express.Router();
const userController = require("../controllers/userControllers")
const bookController = require("../controllers/bookControllers")
const reviewController = require("../controllers/reviewControllers")

// To rgistar a user
router.post("/register", userController.createUser)
// Login for a user
router.post("/login", userController.userLogin)

router.post("/books", bookController.createBook)
router.get("/books", bookController.getBook)
router.get("/books/:bookId", bookController.getBookById)



router.post("/books/:bookId/review", reviewController.postReview)




module.exports = router;