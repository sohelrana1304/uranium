const express = require('express');

const logger = require('../logger/logger')
const helper = require('../util/helper')
const formatter = require('../validator/formatter')

const lodash = require('lodash')

const router = express.Router();

router.get('/test-me', function (req, res) {
    
    //Problem No. 1
    logger.logging()

    //Problem No. 2
    helper.printDate()
    helper.printMonth()
    helper.getBatchinfo()

    //Problem No. 3
    formatter.trim()
    formatter.calltoLowerCase()
    formatter.callToUpperCase()


    res.send('My first ever api!')
});

router.get('/hello', function (req, res) {
    
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let arrangeMonths = lodash.chunk(months, 3)
    console.log('Months are:', arrangeMonths)
    
    let oddNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    let printOddnumbers = lodash.tail(oddNumbers)
    console.log('Last 9 Odd Numbers are: ', printOddnumbers)

    let duplicateNmbers = [1, 4, 5, 4, 6, 3, 5]
    let filteredNumber = lodash.union(duplicateNmbers)
    console.log('Filtered numbers are :', filteredNumber)

    let arrayofPairs = [["horror","The Shining"],["drama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]]
    let pairArray = lodash.fromPairs(arrayofPairs)
    console.log('Pairs of Arays are:', pairArray)
    res.send('My first ever api!')
});

module.exports = router;