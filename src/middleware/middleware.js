const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")

let authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(404).send({ status: false, msg: "Token must be present" });
        let decodedToken = jwt.verify(token, "India");

        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "Invalid Token" })

        req.tokenUserId = decodedToken.userId

        next();
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


const authorization = async function (req, res, next) {
    try {
        let tokenUserId = req.tokenUserId
        let user = req.body.userId
        let user2 = req.params.bookId

        if (user2) {
            // user2 = req.params.userId
            
            // Checking the inputted bookId valid or not
            if (!validator.isValidObjectId(user2)) {
                return res.status(404).send({ status: false, message: "Book id is not valid" })
            }

            // Finding the bookId from existing db
            let uniqueBlogId = await bookModel.findOne({ _id: user2 })
            if (!uniqueBlogId) {
                return res.status(404).send({ status: false, message: "Book not found" })
            }

            // Selecting userId
            let getUserId = await bookModel.findById({ _id: user2 }).select({ userId: 1 })
            // console.log(getUserId)
            let findUserId = getUserId.userId.toString() //for extrxting id like this - 626ba1610a95a6c52d0b4d0b
            // console.log("For User2: ", findUserId, tokenUserId)
            if (findUserId != tokenUserId) {
                return res.status(401).send({ status: false, message: "User should log in" })
            }

        } else if (user) {
            // console.log("For User1: ", user, tokenUserId)

            // Checking the inputted userId valid or not
            if (!validator.isValidObjectId(user)) {
                return res.status(404).send({ status: false, message: "User id is not valid" })
            }

            // Finding the inputted userId's existance from db
            let uniqueUserId = await userModel.findById({ _id: user })
            if (!uniqueUserId) {
                return res.status(404).send({ status: false, message: "UserId is not exist in our data base" })
            }

            if (user != tokenUserId) {
                return res.status(401).send({ msg: "User must login" })
            }

        }

        next();
    }
    catch (error) {
        console.log("This is an error: ", error.message)
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.authentication = authentication
module.exports.authorization = authorization