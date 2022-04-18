const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const bookController= require("../controllers/bookController")
const publisherController= require("../controllers/publisherControl")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})



router.post("/createAuthor", authorController.createAuthor  )  // Question No. 1

router.post("/createPublisher", publisherController.createPublisher ) // Question No. 2

router.post("/createBook", bookController.createBook)   // Question No. 3

router.get("/getAllBooks", bookController.getAllBooks)  // Question No. 4

router.put("/updateBooks", bookController.updateBooks)  // Question No. 5.a

router.put("/updateBooksPrice", bookController.updateBooksPrice)  // Question No. 5.b





router.get("/getAuthorsData", authorController.getAuthorsData)

router.post("/createBook", bookController.createBook  )

router.get("/getBooksData", bookController.getBooksData)

router.get("/getBooksWithAuthorDetails", bookController.getBooksWithAuthorDetails)



module.exports = router;