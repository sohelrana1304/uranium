const express = require('express')
const router = express.Router();
const userController = require("../controllers/userControllers")

// To rgistar a user
router.post("/register", userController.createUser)
// Login for a user
router.post("/login", userController.userLogin)




module.exports = router;