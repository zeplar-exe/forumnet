require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const defaultServiceProvider = require('./services/service_provider.js')

const authRoute = require('./routes/authRoute.js')(defaultServiceProvider)

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.post("/auth/signup", authRoute.signUp)
app.post("/auth/login", authRoute.logIn)

app.listen(parseInt(process.env.PORT ?? "8080"), "localhost", () => console.log(`forumnet-api (express) listening on port ${process.env.PORT}`))