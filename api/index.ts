require('dotenv').config()

import express = require('express')
import { Request, Response, NextFunction } from "express"
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')
import cors = require('cors')

import { ServiceProviderImpl } from "./services/service_provider"
import { ServiceLayerError } from './common/http_error'
import { UserRole } from 'models/user_role'

if (!process.env.PORT)
    throw new Error("PORT environment variable is missing.")

var defaultServiceProvider = new ServiceProviderImpl()

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.use((req: Request, res: Response, next: NextFunction) => {
    if (defaultServiceProvider.api.getLockdownStatus()) {
        var user = defaultServiceProvider.auth.authenticate(req)

        if (!user || user.role < UserRole.SiteAdmin) {
            res.status(503).end()
            return
        }
    }
    
    next()
})

app.use("/", require('./routes/apiRoute')(defaultServiceProvider))
app.use("/", require('./routes/authRoute')(defaultServiceProvider))
app.use("/", require('./routes/forumRoute')( defaultServiceProvider))
app.use("/", require('./routes/forumUserRoute')(defaultServiceProvider))
app.use("/", require('./routes/postRoute')(defaultServiceProvider))
app.use("/", require('./routes/usersRoute')(defaultServiceProvider))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if (err instanceof ServiceLayerError) {
        var serviceLayerError = err as ServiceLayerError
        
        res.status(serviceLayerError.status)

        if (err.message)
            res.json({ message: err.message })

        res.end()

        return
    }
    else {
        next()
    }
})

app.listen(parseInt(process.env.PORT), "localhost", () => console.log(`forumnet-api (express) listening on port ${process.env.PORT}`))