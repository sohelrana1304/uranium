const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


// 1. Write a POST api /users to register a user from the user details in request body.

const createUser = async function (abcd, xyz) {
  //You can name the req, res objects anything.
  //but the first parameter is always the request 
  //the second parameter is always the response
  let data = abcd.body;
  let savedData = await userModel.create(data);
  console.log(abcd.newAtribute);
  xyz.send({ msg: savedData });
};


// 2. Write a *POST api /login to login a user that takes user details - email and password from the request body. If the credentials don't match with any user's data return a suitable error. On successful login, generate a JWT token and return it in response body.

const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;

  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.send({
      status: false,
      msg: "username or the password is not corerct",
    });

  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret
  // The same secret will be used to decode tokens
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "uranium",
      organisation: "FUnctionUp",
    },
    "functionup-uranium"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, data: token });
};


// 3. Write a GET api /users/:userId to fetch user details. Pass the userId as path param in the url. Check that request must contain x-auth-token header. If absent, return a suitable error. If present, check that the token is valid.

const getUserData = async function (req, res) {
  //   let token = req.headers["x-Auth-token"];
  //   if (!token) token = req.headers["x-auth-token"];

  //   //If no token is present in the request header return error
  //   if (!token) return res.send({ status: false, msg: "token must be present" });

  //   console.log(token);

  //   // If a token is present then decode the token with verify function
  //   // verify takes two inputs:
  //   // Input 1 is the token to be decoded
  //   // Input 2 is the same secret with which the token was generated
  //   // Check the value of the decoded token yourself
  //   let decodedToken = jwt.verify(token, "functionup-uranium");
  //   if (!decodedToken)
  //     return res.send({ status: false, msg: "token is invalid" });

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
};


// 4. Write a PUT api /users/:userId to update user details. Pass the userId as path param in the url and update the attributes received in the request body. Check that request must contain x-auth-token header. If absent, return a suitable error.

const updateUser = async function (req, res) {
  
  //     let token = req.headers["x-Auth-token"];
  //   if (!token) token = req.headers["x-auth-token"];
  //   //If no token is present in the request header return error
  //   if (!token) return res.send({ status: false, msg: "token must be present" });
  //   let decodedToken = jwt.verify(token, "functionup-uranium");
  //   if (!decodedToken)
  //     return res.send({ status: false, msg: "token is invalid" });


  // Do the same steps here:
  // Check if the token is present
  // Check if the token present is a valid token
  // Return a different error message in both these cases

  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  //Return an error if no user with the given id exists in the db
  if (!user) {
    return res.send("No such user exists");
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.send({ status: updatedUser, data: updatedUser });
};



//5. Write a DELETE api /users/:userId that takes the userId in the path params and marks the isDeleted attribute for a user as true. Check that request must contain x-auth-token header. If absent, return a suitable error.

const deleteUser = async function (req, res, next) {

  //     let token = req.headers["x-Auth-token"];
  //     if (!token) token = req.headers["x-auth-token"];

  //   //If no token is present in the request header return error
  //   if (!token) return res.send({ status: false, msg: "token must be present" });
  //   console.log(token);
  //   let decodedToken = jwt.verify(token, "functionup-uranium");
  //   if (!decodedToken)
  //     return res.send({ status: false, msg: "token is invalid" });

  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if (!user) {
    return res.send("No such user exists");
  }
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { isDeleted: false }, { new: true, upsert: true });
  res.send({ status: updatedUser, data: updatedUser });
}




module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
