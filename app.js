// Packages
const express = require("express")
const path = require("path")
const favicon = require("serve-favicon")
const logger = require("morgan")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const dotenv = require("dotenv").config()



const app = express()

// View engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")))
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))


// Controller
const index = require("./controllers/index")
const db = require("./controllers/db/collection")
const bithumb = require("./controllers/api/bithumb")
const job = require("./controllers/job/index")

app.use("/", index)
app.use("/db/collection", db)
app.use("/api/bithumb", bithumb)
app.use("/job", job)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app