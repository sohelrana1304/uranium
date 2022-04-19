const express = require('express');
const router = express.Router();

const batchController = require("../controllers/batchController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createBatch", batchController.createBatch)    //  Question No. 1

router.post("/createDeveloper", batchController.createDeveloper)     //  Question No. 2

router.get("/scholarship-developers", batchController.scholarshipDev)    //  Question No. 3

router.get("/devReturn", batchController.devReturn)  //  Question No. 4

// router.get("/getAuthorsData", authorController.getAuthorsData)

// router.post("/createBook", bookController.createBook  )

// router.get("/getBooksData", bookController.getBooksData)

// router.get("/getBooksWithAuthorDetails", bookController.getBooksWithAuthorDetails)

module.exports = router;