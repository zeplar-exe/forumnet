import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { BadRequestError, ConflictError, UnauthorizedError } from '../common/http_error';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/forum_users/:forum_user_id", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()

        var forumUser = serviceProvider.forum_user_repository.getUserById(req.params.forum_user_id)

        if (!forumUser)
            throw new BadRequestError("The given forum user does not exist.")

        res.status(200).json(forumUser)
    })

    const createSchema = Joi.object({
        forum: Joi.string().required(),
        display_name: Joi.string().required(),
        biography: Joi.string().required(),
        links: Joi.array<string>().required()
    })

    router.post('/forum_users/create', validator.body(createSchema), (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()

        var forumId = req.body.forum
        
        var existingUsers = serviceProvider.forum_user_repository.getUsersByAssociated(user.id)

        if (existingUsers && existingUsers.find(user => user.forum_id == forumId))
            throw new ConflictError("A forum user for this account already exists.")
        
        var forumUser = serviceProvider.forum_user_repository.createUser(user.id, forumId, req.body.display_name)

        res.status(200)
            .setHeader("Location", `/forum_users/${forumUser.id}`)
            .json({ forum_user: forumUser })
    })
    
    return router
}