require('dotenv').config()

import express = require('express')
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')

import { ServiceProviderImpl } from 'services/service_provider'

var defaultServiceProvider = new ServiceProviderImpl()

const authRoute = require('./routes/authRoute.js')(defaultServiceProvider)

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.post("/auth/signup", authRoute.signUp)
app.post("/auth/login", authRoute.logIn)

app.listen(parseInt(process.env.PORT ?? "8080"), "localhost", () => console.log(`forumnet-api (express) listening on port ${process.env.PORT}`))