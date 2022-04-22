const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const commonMW= require("../middleWare/auth")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser  ) // 1

router.post("/login", userController.loginUser) // 2

// router.post("/login2", commonMW.loginUser2, userController.loginUser)

//The userId is sent by front end
// router.get("/users/:userId", userController.getUserData)

router.get("/users/:userId", commonMW.tokenAuth, userController.getUserData) // 3

// router.put("/users/:userId", userController.updateUser)

router.put("/users/:userId", commonMW.tokenAuth, userController.updateUser) // 4

// router.delete("/users/:userId", userController.deleteUser)

router.delete("/users/:userId", commonMW.tokenAuth, userController.deleteUser) //5

module.exports = router;