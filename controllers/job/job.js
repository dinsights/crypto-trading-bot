// Packages
const schedule = require("node-schedule")
const express = require("express")
const router = express.Router()
const util = require("../../utils/util")
const request = require("request")

// Loading scripts
const scrapData = require("./list/scrapData")

// Job Lists...
let jobList = {
    scrapData: scrapData.start
}

router.get("/scrapData", (req, res, next) => {
    setInterval(() => {
        jobList.scrapData("btc")
    }, 2000)
    res.send({"message": "data scrapping is started..."})
})

router.get("/:jobName",(req, res, next) => {
    let time = {
        date: req.query.date,
        hour: req.query.hour,
        minute: req.query.minute,
        second: req.query.second
    }
    let jobName = req.params.jobName
    schedule.scheduleJob(time, () => {
    })
})

module.exports = router
