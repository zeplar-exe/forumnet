import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { BadRequestError, UnauthorizedError } from '../common/http_error';
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    const createSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional()
    })

    router.get('/forums/info/:id', (req: Request, res: Response) => {
        var forumId = req.query.id as string
        var forum = serviceProvider.forum_repository.getForumById(forumId)

        if (!forum)
            throw new BadRequestError("The given forum id does not exist.")

        res.json(forum).end()
    })

    const searchSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().required(),
        description: Joi.string().optional().default("")
    })

    router.get('/forums/search', validator.query(searchSchema), (req: Request, res: Response) => {
        var nameParts = (req.query.name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
        var descriptionParts = (req.query.name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

        var map = serviceProvider.forum_repository.search(parseInt(req.query.page as string), parseInt(req.query.count as string) as number, nameParts, descriptionParts)

        return res.json(map).end()
    })

    router.post('/forums/create', validator.body(createSchema), (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
        
        var forum = serviceProvider.forum_repository.createForum(req.body.name)
        forum.description = req.body.description

        var forumUser = serviceProvider.forum_user_repository.createUser(user, forum.id, "owner")
        forumUser.is_owner = true
    })
    
    return router
}