let printDate = function(){
    let today = new Date()
    let date = today.getDate()+'-'+(today.getMonth() + 1)+'-'+today.getFullYear()
    
    console.log('Current date : ', date)
}
let printMonth = function(){
    let today = new Date()
    let month = today.getMonth() + 1
   
    console.log('Current month : ', month)
}
let getBatchinfo = function(){
    console.log('Uranium, W3D3, the topic for today is Nodejs module system.')
}
 module.exports.printDate = printDate
 module.exports.printMonth = printMonth
 module.exports.getBatchinfo = getBatchinfo