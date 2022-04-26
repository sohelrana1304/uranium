let axios = require("axios")


let getStates = async function (req, res) {

    try {
        let options = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getDistricts = async function (req, res) {
    try {
        let id = req.params.stateId
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getByPin = async function (req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getOtp = async function (req, res) {
    try {
        let blahhh = req.body

        console.log(`body is : ${blahhh} `)
        var options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
            data: blahhh
        }

        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

// 1. WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date

let getDistrictsSession = async function (req, res) {

    try {
        let district = req.query.districtId
        let date = req.query.date
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`,
        }

        let result = await axios(options)
        console.log(result.data)

        res.status(200).send({ msg: result.data })
    }
    catch (error) {
        console.log(console.error)
        res.status(500).send({ msg: error.message })
    }

}


// 2/

let getWeatherData = async function (req, res) {

    try {
        let cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata","Chennai", "London", "Moscow"]
        let cityArr = []

        for (let i = 0; i < cities.length; i++) {
            let obj = { city: cities[i] }

            let options = {
                method: "get",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=0e103e2ec302f40d42c7031a7f1261ee`
            }

            let resp = await axios(options)
            console.log(resp.data.main.temp)

            obj.temp = resp.data.main.temp
            cityArr.push(obj)
        };
        let sortedCity = cityArr.sort((a, b) => { return a.temp - b.temp })

        console.log(sortedCity)
        res.status(200).send({ status: true, data: sortedCity })
    }
    catch (error) {
        console.log(console.error)
        res.status(500).send({ msg: error.message })
    }

}

//  3.

let createMemes = async function (req, res) {

    try {
        let template_id = req.query.template_id
        let text0 = req.query.text0
        let text1 = req.query.text1
        let username = req.query.username
        let password = req.query.password

        let options = {
            method: "post",
            url: `https://api.imgflip.com/caption_image?template_id=${template_id}&text0=${text0}&text1=${text1}&username=${username}&password=${password}`
        }

        let result = await axios(options)
        console.log(result.data)

        res.status(200).send({ msg: result.data })
    }
    catch (error) {
        console.log(console.error)
        res.status(500).send({ msg: error.message })
    }

}




module.exports.getStates = getStates
module.exports.getDistricts = getDistricts
module.exports.getByPin = getByPin
module.exports.getOtp = getOtp
module.exports.getDistrictsSession = getDistrictsSession
module.exports.getWeatherData = getWeatherData
module.exports.createMemes = createMemes