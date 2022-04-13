const BookModel = require("../models/bookModel")
const userModel = require("../models/userModel")

const createBook = async function (req, res) {
    let data = req.body
    let savedData = await BookModel.create(data)
    res.send({ msg: savedData })
}

const bookList = async function (req, res) {
    let allBooks = await BookModel.find().select({ bookName: 1, authorName: 1, _id: 0 })
    res.send({ msg: allBooks })
}

const getBooksInYear = async function (req, res) {
    let year = req.query.year
    let savedData = await BookModel.find({ year }).select()
    res.send({ msg: savedData })
}

const getXINRBooks = async function (req, res) {
    let inrBooks = await BookModel.find({ "prices.indianPrice": { $in: ["Rs 100/-", "Rs 300/-"] } })
    res.send({ msg: inrBooks })
}


const getRandomBooks = async function (req, res) {
    let randomBooks = await BookModel.find({ $or: [{ stockAvailable: true }, { totalPages: { $gt: 200 } }] })
    res.send({ msg: randomBooks })
}

// const getParticularBooks = async (req, res) => {
//     let data = req.body;
//     data.bookName;
//     data.year;
//     data.authorName;
//     data.prices.indianPrice;
//     data.totalPages;
//     let allBooks = await bookUserModel.find(data).select({ bookName: true, authorName: true, price: { indianPrice: true }, _id: 0 })
//     res.send({ message: allBooks })
// }

const getParticularBooks = async function (req, res) {
    let data = req.body
    // data.bookName;
    // data.year;
    // data.authorName;
    // data.prices.indianPrice;
    // data.totalPages;

    let specificBooks = await BookModel.find(data)
    res.send({ msg: specificBooks })
}


module.exports.createBook = createBook
module.exports.bookList = bookList
module.exports.getBooksInYear = getBooksInYear
module.exports.getXINRBooks = getXINRBooks
module.exports.getRandomBooks = getRandomBooks
module.exports.getParticularBooks = getParticularBooks

