const express = require("express")
const router = express.Router()

// GET /
router.get("/", (req, res, next) => {
  res.render("index", { title: "crypto-trading-bot" })
})

module.exports = router
