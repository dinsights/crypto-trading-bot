// Information
//// Author: jhlee@dinsights.net
//// Comment
//// 1) If you want to make MongoDB CRUD Server, use body to handle data. For Example, body.filter, body.sort, body.limit, body.update...

// PACKAGES
const express = require("express")
const router = express.Router()
const util = require("../../utils/util")
const mongodb = require("mongodb")
const dotenv = require("dotenv").config()
let ObjectID = require('mongodb').ObjectID


// Variables
const dbUri = process.env.DB_URI
const dbName = process.env.DB_NAME


// Functions
let connect = async () => {
    let connection = await mongodb.MongoClient.connect(dbUri, {useNewUrlParser: true})
    return connection
}

// CRUD

//// Create document => POST /db/collection/:collection
router.post("/:collection", async (req, res, next) => {
    let connection = await connect()
    let db = connection.db(dbName)
    let doc = {
        createdAt: new Date(), //if there is no "createdAt" field then make "createdAt" field
        ...req.body.doc
    }
    doc = await util.kvParser(doc)
    db.collection(req.params.collection).insertOne(doc, (error, result) => {
        if(error) {
            res.type("application/json").json(error).end()
            connection.close()
        } else {
            res.type("application/json").json(result).end()
            connection.close()
        }
    })
})

//// Read by query => GET /db/collection/:collection
router.get("/:collection", async (req, res, next) => {
    let connection = await connect()
    let db = connection.db(dbName)
    let filter = req.body.filter !== undefined? req.body.filter: {}
    let options = {
        projection: req.body.projection,
        skip: req.body.skip,
        limit: req.body.limit,
    }
    db.collection(req.params.collection).find(filter, options).sort(req.body.sort).toArray((error, result) => {
        if(error) {
            res.type("application/json").json(error).end()
            connection.close()
        } else {
            res.type("application/json").json(result).end()
            connection.close()
        }
    })
})

//// Read by _id => GET /db/collection/:collection/:_id
router.get("/:collection/:_id", async (req, res, next) => {
    let connection = await connect()
    let db = connection.db(dbName)
    try {
        filter = {
            _id: mongodb.ObjectId(req.params._id)
        }
    } catch(error) {
        console.error(error)
        filter = await util.kvParser({
            _id: req.params._id
        })
    }
    db.collection(req.params.collection).findOne(filter, (error, result) => {
        if(error) {
            res.type("application/json").json(error).end()
            connection.close()
        } else {
            res.type("application/json").json(result).end()
            connection.close()
        }
    })
})

//// Update by query => PUT /db/collection/:collection 
router.put("/:collection", async (req, res, next) => {
    let connection = await connect()
    let db = connection.db(dbName)
    let filter = req.body.filter
    let update = req.body.update
    let options = req.body.options
    db.collection(req.params.collection).updateMany(filter, update, options, (error, result) => {
        if(error) {
            res.type("application/json").json(error).end()
            connection.close()
        } else {
            res.type("application/json").json(result).end()
        }
    })
})

//// Update by _id => PUT /db/:collection/:_id
router.put("/:collection/:_id", async (req, res, next) => {
    let connection = await connect()
    let db = connection.db(dbName)
    try {
        filter = {
            _id: mongodb.ObjectId(req.params._id)
        }
    } catch(error) {
        console.error(error)
        filter = await util.kvParser({
            _id: req.params._id
        })
    }
    let update = req.body.update
    let options = req.body.options
    db.collection(req.params.collection).updateOne(filter, update, options, (error, result) => {
        if(error) {
            res.type("application/json").json(error).end()
            connection.close()
        } else {
            res.type("application/json").json(result).end()
            connection.close()
        }
    })
})

module.exports = router