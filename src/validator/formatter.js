function trim() {
    let text = '  Sohel   '
    console.log('Trimmed text is: ', text.trim())
}

function calltoLowerCase() {
    let text = 'SOHEL'
    console.log('Text in lowercase is: ', text.toLowerCase())
}

function callToUpperCase() {
    let text = 'sohel'
    console.log('Text in uppercase is: ', text.toUpperCase())
}

module.exports.trim = trim
module.exports.calltoLowerCase = calltoLowerCase
module.exports.callToUpperCase = callToUpperCase