require('dotenv').config()

import express = require('express')
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')

import { ServiceProviderImpl } from 'services/service_provider'

var defaultServiceProvider = new ServiceProviderImpl()

const app = express()
const router = app.router

app.use(bodyParser.json())
app.use(cookieParser())

require('./routes/authRoute.js')(router, defaultServiceProvider)
require('./routes/forumRoute')(router, defaultServiceProvider)
require('./routes/forumUserRoute')(router, defaultServiceProvider)
require('./routes/postRoute')(router, defaultServiceProvider)

app.listen(parseInt(process.env.PORT ?? "8080"), "localhost", () => console.log(`forumnet-api (express) listening on port ${process.env.PORT ?? "8080"}`))