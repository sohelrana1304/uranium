const userModel = require("../models/userModel")
const UserModel= require("../models/userModel")
const BookModel = require("../models/userModel")
// const BookModel = require("../models/userModel")
const { all } = require("../routes/route")


const createUser= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}


// mongo-session1 assgnment

const addBook = async function(req, res) {
    let bookData = req.body
    let savebookData = await BookModel.create(bookData)
    res.send({msg: savebookData})
}

const allbooksData = async function (req, res){
    let allBooks = await BookModel.find()
    res.send({msg: allBooks})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData

module.exports.addBook = addBook
module.exports.allbooksData = allbooksData