const batchModel = require("../models/batchModel")
const developerModel = require("../models/developerModel")

//  1. Write an api POST /batches that creates a batch from the details in the request body. Please note that the program should be an enum with the following allowed values only - backend and frontend

const createBatch= async function (req, res) {
    let batch = req.body
    let batchCreated = await batchModel.create(batch)
    res.send({data: batchCreated})
}


//  2. Write an api POST  /developers that creates a developer from the details in the request body. Please note that the gender should be an enum with the following allowed values - male, female and other. Also, batch attribute is a reference to the batches collection.

const createDeveloper = async function (req, res) {
    let developer = req.body
    let developerCreated = await developerModel.create(developer)
    res.send({data: developerCreated})
}


// 3. Write an api GET /scholarship-developers that fetches the list of eligible developers for scholarship. An eligible developer is female with percentage greater than or equal to 70

const scholarshipDev = async function (req, res) {
    let eligibleDev = await developerModel.find({gender: "female", percentage: {$gte: 70}})
    res.send({data: eligibleDev})
}

//  4. Write an api GET /developers?percentage=value1&program=value2 that only returns the developers for a given program with a percentage greater than or equal to the received value. Please note the batch name and the program values are received in the request as query params.
    
    //For example GET /developers?percentage=55&program=radium should return all the developers from radium batch with a percentage greater than or equal to 55

const devReturn = async function (req, res) {
    
    let value1 = req.query.percentage
    let value2 = req.query.program
    let id = await batchModel.findOne({name: value2}).select({_id : 1})
    let listOut = await developerModel.find({percentage : {$gte : value1}, batch : id}).select({name : 1, _id : 0})
    
    res.send({data: listOut})
}



module.exports.createBatch = createBatch
module.exports.createDeveloper = createDeveloper
module.exports.scholarshipDev = scholarshipDev
module.exports.devReturn = devReturn