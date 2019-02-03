// Packages
//const mongodb = require("mongodb")

// KVPARSER2
let kvParser = (object) => {return new Promise((resolve, reject) => {
    Object.keys(object).map(async key => {
        if(object[key] == "true") {return object[key] = true}
        else if(object[key] == "false") {return object[key] = false}
        else if(/\d*-\d*-\d*T\d*:\d*:\d*.\d*Z/.test(object[key])==true) {return object[key] = new Date(object[key])}
        else if(/\d*-\d*-\d*/.test(object[key])==true) {return object[key] = new Date(object[key])}
        else if(/^(0|[1-9][0-9]*)$/.test(object[key])==true) {return object[key] = parseInt(object[key])}
        else if(/^([0-9]*\.[0-9]*)$/.test(object[key])==true) {return object[key] = parseFloat(object[key])}
        else if(/^[0-9a-fA-F]{24}$/.test(object[key])==true) {return object[key] = mongodb.ObjectId(object[key])}
        else if(typeof object[key] == "object") {return object[key] = await kvParser(object[key])}
        else if(typeof object[key] == "array") {return object[key] = object[key].map(value => kvParser(value))}
        else {return object[key] = object[key]}
    })
    resolve(object)
})}
exports.kvParser = kvParser
