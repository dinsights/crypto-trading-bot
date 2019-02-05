const request = require("request")
const dotenv = require("dotenv"); dotenv.config()

// Variables
const localhost = process.env.LOCALHOST

// Functions
let options = (qs, body) => {
    return {
        headers: {
            "Content-type":"application/json"
        }, 
        json: true,
        qs: qs !== null? qs: {},
        body: body !== null? body: {}
    }
}

// get index data from history-btc collection and get transaction history from bithumb api and create document in history-btc collection
let getIndexData = (currency) => {return new Promise(
    (resolve) => {
        let uri = localhost + "/db/collection/history-" + currency
        request.get(
            uri, options({}, {"sort": {"_id": -1}, "limit": 1}), (error, response) => {
                if(error) {
                    console.error(error)
                } else {
                    if(response.body.length == 0) {
                        console.log("initial data")
                        resolve(0)
                    } else {
                        //console.log(response.body[0])
                        resolve(response.body[0]._id)
                    }
                }
            }
        )
    })
}

let getTransactionData = (currency, index) => {return new Promise(
    (resolve) => {
        let qs = {
            "cont_no": index + 101,
            "count": 100
        }
        request.get(
            localhost + "/api/bithumb/transaction_history/" + currency,
            options(qs),
            (error, response) => {
                if(error) {
                    console.error(error)
                } else {
                    resolve(response.body)
                }
            }
        )
    })
}

let createTransactionData = (currency, /*index,*/ transactionData) => {return new Promise(
    (resolve, reject) => {
        let data = transactionData
        let uri = localhost + "/db/collection/history-" + currency
        let doc = {
            _id: data.cont_no,
            createdAt: data.transaction_date,
            type: data.type,
            units: data.units_traded,
            price: data.price,
            size: data.total
        }
        request.post(uri, options({}, {doc: doc}), async (error, response) => {
            if(error) {
                console.error(error)
            } else {
                if(response.body.ok==1) {
                    resolve(response.body.ok)
                } else if (response.body.code==11000) {
                    /*index = index+1
                    transactionData = await getTransactionData(currency, index)
                    createTransactionData(currency, index, transactionData)*/
                    resolve(response.body.code)
                }
            }
        })
    }
)}

let start = async (currency) => {
    let index = await getIndexData(currency)
    let transactionData = await getTransactionData(currency, index)
    transactionData.sort((a,b) => {return a.cont_no - b.cont_no}).forEach(value => {
        createTransactionData(currency, value)
    })
    //console.log(transactionData)
}

exports.getIndexData = getIndexData
exports.getTransactionData = getTransactionData
exports.start = start