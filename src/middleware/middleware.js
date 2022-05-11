const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel");
const validator = require("../validator/validator")

let authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(404).send({ status: false, msg: "Token must be present" });
        let decodedToken = jwt.verify(token, "India");

        // if (err) {
        //     if (err.name === 'JsonWebTokenError')
        //         return res.send(createError.Unauthorized())
        // } else {
        //     return res.send(createError.Unauthorized(err.message))
        // }


        // if (!decodedToken)
        //     return res.status(400).send({ status: false, msg: "Invalid Token" })
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

        if (validator.isValidObjectId.user2) {
            // user = req.params.userId
            let getUserId = await bookModel.findById({ _id: user2 }).select({ userId: 1 })
            // console.log(getUserId)
            let findUserId = getUserId.userId.toString() //for extrxting id like this - 626ba1610a95a6c52d0b4d0b
            // console.log("For User2: ", findUserId, tokenUserId)
            if (findUserId != tokenUserId) {
                return res.status(401).send({ status: false, message: "User should log in" })
            }
            
        } else if (user) {
            // console.log("For User1: ", user, tokenUserId)
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