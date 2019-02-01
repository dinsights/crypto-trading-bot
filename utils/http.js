// Packages
const request = require("request")
const util = require("./util")

// http GET
let get = (uri, query, body) => {return new Promise((resolve, reject) => {
    request.get(uri, {headers:{"Content-type":"application/json"}, json: true, qs: query, body: body}, (error, response, body)=>{
        if(error) console.error(error)
        let result = util.kvParser(body)
        resolve(result)
    })
})}
exports.get = get

let post = (uri, query, body) => {return new Promise((resolve, reject) => {
    request.post(uri, {headers:{"Content-type":"application/json"}, json: true, qs: query, body: body}, (error, response, body) => {
        if(error) console.error(error)
        let result = util.kvParser(body)
        resolve(result)
    })
})}
exports.post = post

let put = (uri, query, body) => {return new Promise((resolve, reject) => {
    request.put(uri, {headers:{"Content-type":"application/json"}, json: true, qs: query, body: body}, (error, response, body) => {
        if(error) console.error(error)
        let result = util.kvParser(body)
    })
})}