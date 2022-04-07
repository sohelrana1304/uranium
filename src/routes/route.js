const express = require('express');
const logger = require('./logger')

const router = express.Router();

router.get('/test-me', function (req, res) {
    // console.log('------------------')
    // console.log(req)
    // console.log('------------------')
    // console.log('These are the request query parameters: ', req.query)

    let candidatesList = ["Sohel", "Rana", "Wasim", "Ripon", "Galib", "Rahul"]
    console.log('Candidates are:', candidatesList)


    res.send('My first ever api!')
});



module.exports = router;
// adding this comment for no reason