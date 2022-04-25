const jwt = require("jsonwebtoken");

// Checking the token in request header and also for validation
const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-Auth-token"];
        if (!token) token = req.headers["x-auth-token"];

        //If no token is present in the request header return error
        if (!token) return res.send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "functionup-uranium");
        if (!decodedToken)
            return res.send({ status: false, msg: "token is invalid" });
    }
    catch (error) {
        console.log("This is an error:", error.message)
        res.status(500).send({ msg: "error", error: error.message })
    }
    next()

};


//userId comparision to check if the logged-in user is requesting for their own data
const authorise = function (req, res, next) {
    try {
        let userToBeModified = req.params.userId
        //userId for the logged-in user
        let token = req.headers["x-Auth-token"];
        if (!token) token = req.headers["x-auth-token"];
        if (!token) return res.send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "functionup-uranium");
        let userLoggedIn = decodedToken.userId

        if (userToBeModified != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
    }
    catch (error) {
        console.log("This is an error:", error.message)
        res.status(500).send({ msg: "error", error: error.message })
    }
    next()
}

module.exports.authenticate = authenticate;
module.exports.authorise = authorise