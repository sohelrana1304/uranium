const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const route = require('./route/route')

const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://Nitesh-functionup:KPIi6eiSDEqH90a2@cluster0.teo4s.mongodb.net/group47Database", {useNewUrlParser:true})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
