const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const moment = require('moment');
// const { format } = require('express/lib/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://sohel:India123@cluster0.v2okl.mongodb.net/sohel-DB", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use (
    function (req, res, next) {
        console.log(moment().format('YYYY-DD-MM HH:mm:ss'), ',' ,req.ip, ',' ,req.path);
        // console.log('Time:', moment().format('YYYY-DD-MM HH:mm:ss'));
        // console.log('Route Handel:', req.path);
        // console.log('User Ip:', req.ip);
        next();
  }
  );

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
