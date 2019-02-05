// Packages
const express = require("express")
const router = express.Router()
const util = require("../../utils/util")
const request = require("request")

// Local Functions
let options = (req) => {
    return {
        headers: {
            "Content-type":"application/json"
        }, 
        json: true,
        qs: req.query,
        body: req.body
    }
}

let getData = (uri, req, res) => {request.get(uri, options(req), async (error, response) => {
    if(error) {
        console.error(error)
        res.type("application/json").send(error).end()
    } else {
        response = await util.kvParser(response.body.data)
        res.type("application.json").json(response)
    }
})}

// info/account
router.get("/info/account", async (req, res, next) => {
    let uri = "https://api.bithumb.com/info/account"
    getData(uri, req, res)
})


// ticker GET /bithumb/ticker
router.get("/ticker/:currency",(req, res, next) => {
    let uri = "https://api.bithumb.com/public/ticker/" + req.params.currency
    getData(uri, req, res)
})

// orderbook GET /api/bithumb/ticker
//// group_orders: [0, 1], count: [1~50]
router.get("/orderbook/:currency", (req, res, next) => {
    let uri = "https://api.bithumb.com/public/orderbook/" + req.params.currency
    getData(uri, req, res)
})

// transaction_history GET /api/bithumb/transaction_history
//// cont_no: interger, count: [1~100]
router.get("/transaction_history/:currency", async (req, res, next) => {
    let uri = "https://api.bithumb.com/public/transaction_history/" + req.params.currency
    getData(uri, req, res)
})

// PUT
// Don't use, this is external api


// DELETE
// Don't use, this is external api

module.exports = router
