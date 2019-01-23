// PACKAGES
const express = require("express")
const router = express.Router()
const http = require("../../utils/http")
const util = require("../../utils/util")

// CONTROLLER

// POST
// Don't use, this is external api


// ticker GET /bithumb/ticker
router.get("/ticker/:currency", async (req, res, next) => {
    try {response = await http.get("https://api.bithumb.com/public/ticker/" + req.params.currency, req.query)} catch(error) {console.error(error)}
    response = await util.kvParser(response)
    res.type("application/json").json(response.data)
})

// orderbook GET /api/bithumb/ticker
//// group_orders: [0, 1], count: [1~50]
router.get("/orderbook/:currency", async (req, res, next) => {
    try {response = await http.get("https://api.bithumb.com/public/orderbook/" + req.params.currency, req.query)} catch(error) {console.error(error)}
    response = await util.kvParser(response)
    res.type("application/json").json(response.data)
})

// transaction_history GET /api/bithumb/transaction_history
//// cont_no: interger, count: [1~100]
router.get("/transaction_history/:currency", async (req, res, next) => {
    try {response = await http.get("https://api.bithumb.com/public/transaction_history/" + req.params.currency, req.query)} catch(error) {console.error(error)}
    response = await util.kvParser(response)
    res.type("application/json").json(response.data)
})

// PUT
// Don't use, this is external api


// DELETE
// Don't use, this is external api

module.exports = router
