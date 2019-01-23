// Packages
const request = require("request")

// http GET
let get = (uri, query, doc) => {return new Promise((resolve, reject) => {
    request.get(uri, {headers:{"Content-type":"application/json"}, json: true, qs: query, body: doc}, (error, response, body)=>{
        if(error) console.error(error)
        let result = body
        resolve(result)
    })
})}
exports.get = get
