const mongoose = require('mongoose')


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === null) {
        return false
    }
    if (typeof (value) === "string" && (value).trim().length == 0) {
        return false
    } return true

}

// Validating objec id
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



module.exports.isValid = isValid;
module.exports.isValidObjectId = isValidObjectId;