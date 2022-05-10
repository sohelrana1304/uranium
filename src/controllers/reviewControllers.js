const reviewModel = require("../models/reviewModel")
const validator = require("../validator/validator")


const postReview = async function(req, res){
    try{

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.postReview = postReview