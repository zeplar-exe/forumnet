import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { BadRequestError, ConflictError, UnauthorizedError } from '../common/http_error';
import { orm } from 'db';
import { ForumUser } from 'models/entities/forum_user';
import { Forum } from 'models/entities/forum';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/forum_users/:forum_user_id", async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()

        var forumUser = await orm.em.findOne(ForumUser, { id: req.params.forum_user_id })

        if (!forumUser)
            throw new BadRequestError("The given forum user does not exist.")

        res.status(200).json(forumUser)
    })

    const createSchema = Joi.object({
        forum: Joi.string().required(),
        display_name: Joi.string().required(),
        biography: Joi.string().required(),
        links: Joi.array<string>().optional().default([])
    })

    router.post('/forum_users/create', validator.body(createSchema), async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()

        var forumId = req.body.forum
        var forum = await orm.em.findOne(Forum, { id: forumId })

        if (forum == null)
            throw new BadRequestError("The given forum does not exist.")

        var existingUsers = await orm.em.find(ForumUser, { associated_user: user })

        if (existingUsers && existingUsers.find(user => user.forum.id == forumId))
            throw new ConflictError("A forum user for this account already exists.")

        var forumUser = new ForumUser(user, forum, req.body.display_name, req.body.biography)

        await orm.em.persistAndFlush(forumUser)

        res.status(200)
            .setHeader("Location", `/forum_users/${forumUser.id}`)
            .json({ forum_user: forumUser })
    })
    
    return router
}