import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { Request, Response, NextFunction } from "express"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mikroOrmConfig from './mikro-orm.config.js'

import { ServiceProviderImpl } from "./services/service_provider.js"
import { ServiceLayerError, ServiceUnavailableError } from './common/http_error.js'
import { UserRole } from './models/enums/user_role.js'
import { RequestContext } from '@mikro-orm/core'
import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";

if (!process.env.PORT)
    throw new Error("PORT environment variable is missing.")

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

console.log("Initializing DB")

export var orm: MikroORM<MariaDbDriver>

var ready = false

async function setup()
{
    orm = await MikroORM.init<MariaDbDriver>(mikroOrmConfig).catch(
        failure_reason => { throw new Error(`Failed to initialize MikroORM with MariaDB: ${failure_reason}`) }
    )
}

await setup().then(success => {
    ready = true
})

while (!ready)
    ;

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

var defaultServiceProvider = new ServiceProviderImpl()
await defaultServiceProvider.init()

app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (defaultServiceProvider.backend_config.maintainence_mode) {
        var user = await defaultServiceProvider.auth.authenticate(req)

        if (!user || user.role < UserRole.SiteAdmin) {
            throw new ServiceUnavailableError("The ForumNet backend is down for maintainence.")
        }
    }
    
    next()
})

import apiRoute from '~/routes/admin/backendRoute.js'
import authRoute from '~/routes/authRoute.js'
import forumRoute from '~/routes/forums/index.js'
import forumUserRoute from '~/routes/forumUserRoute.js'
import usersRoute from '~/routes/usersRoute.js'

app.use("/", apiRoute(defaultServiceProvider))
app.use("/", authRoute(defaultServiceProvider))
app.use("/", forumRoute(defaultServiceProvider))
app.use("/", forumUserRoute(defaultServiceProvider))
app.use("/", usersRoute(defaultServiceProvider))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServiceLayerError) {
        var serviceLayerError = err as ServiceLayerError
        
        res.status(serviceLayerError.status)

        if (err.message)
            res.json({ message: err.message })

        res.end()
    }
    else {
        next()
    }
})

app.listen(parseInt(process.env.PORT), "localhost", () => console.log(`forumnet-api (express) listening on port ${process.env.PORT}`))