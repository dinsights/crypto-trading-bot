// PACKAGES
const express = require("express")
const router = express.Router()
const http = require("../utils/http")
const util = require("../utils/util")
const mongodb = require("mongodb")
const dotenv = require("dotenv").config()


// Variables
const dbUri = PROCESS.env.DB_URI
const dbName = PROCESS.env.DB_NAME


// Connection
let connect = async () => {
    let connection = await mongodb.MongoClient.connect(dbUri)
    let db = await connection.db(dbName)
    return db
}

// CRUD

//// Create document => POST /db/:collection
router.post("/:collection", async (req, res, next) => {
    let db = await connect()
    req.query = await util.kvParser(req.query)
    let doc = req.query.d !== undefined? req.query.doc: {}
    try {response = await db.collection(req.params.collection).insertOne(doc)} catch(error) {console.error(error)}
    res.type("application/json").json(response)
})

//// Read by query => GET /db/:collection
router.get("/:collection", async (req, res, next) => {
    let db = await connect()
    req.query = await util.kvParser(req.query)
    let query = req.query.query !== undefined? req.query.query: {}
    let project = req.query.project !== undefined? req.query.project: {}
    let sort = req.query.sort !== undefined? req.query.sort: {}
    let skip = req.query.skip !== undefined? req.query.skip: {}
    let limit = req.query.limit !== undefined? req.query.limit: {}
    try {
        response = await util.kvParser(db.collection(req.params.collection).find(query).project(project).sort(sort).skip(skip).limit(limit)).toArray()
    }
    catch(error) {console.error(error)}
    res.type("application/json").json(response)
})

//// Read by _id => GET /db/:collection/:_id
router.post("/:collection/:_id", async (req, res, next) => {
    let db = await connect()
    try {
        response = await util.kvParser(db.collection(req.params.collection).findOne({_id: mongodb.ObjectId(req.params._id)}))
    } 
    catch(error) {console.error(error)}
    res.type("application/json").json(response)
})

//// Update by query => PUT /db/:collection 
router.put("/:collection", async (req, res, next) => {
    let db = await connect()
    req.query = await util.kvParser(req.query)
    let query = req.query.q !== undefined? req.query.query: {}
    let doc = req.query.d !== undefined? req.query.doc: {}
    try {response = await db.collection(req.params.collection).updateMany(query, doc)} catch(error) {console.error(error)}
    res.type("application/json").json(response)
})

//// Update by _id => PUT /db/:collection/:_id
router.put("/:collection/:_id", async (req, res, next) => {
    let db = await connect()
    req.query = await util.kvParser(req.query)
    let doc = req.query.doc !== undefined? req.query.d: {}
    try {response = await db.collection(req.params.collection).updateOne({_id: mongodb.ObjectId(req.params._id)}, doc)} catch(error) {console.error(error)}
    res.type("application/json").json(response)
})

//// DELTE


// AGGREGATE
router.get("/aggregate/:collection", async (req, res, next) => {
    let db = await connect()
    req.query = await util.kvParser(req.query)
    let pipeline = req.query.pipeline !== undefined? req.query.pipeline: []
    try {response = await db.collection(req.params.collection).aggregate(pipeline).toArray()} catch(error) {console.error(error)}
})

module.exports = router