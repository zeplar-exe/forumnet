import { Request, Response, Router } from 'express';
import { ServiceProvider } from '../services/service_provider';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    const signupSchema = Joi.object({
        identifier: Joi.string().required().min(1),
        password: Joi.string().required()
    })

    router.post("/auth/signup", validator.body(signupSchema), (req: Request, res: Response) => {
        var sessionToken = serviceProvider.auth.signUp(req.body["identifier"], req.body["password"])

        res.status(200).json({ session_token: sessionToken })
    })

    const loginSchema = Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required()
    })

    router.post("/auth/login", validator.body(loginSchema), (req: Request, res: Response) => {
        var sessionToken = serviceProvider.auth.logIn(req.body["identifier"], req.body["password"])

        res.status(200).json({ session_token: sessionToken })
    })
    
    return router
}