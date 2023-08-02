import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { BadRequestError, UnauthorizedError } from '../common/http_error';
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { requireUserCanAccessForum } from '../common/authorization';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    const searchSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().required(),
        description: Joi.string().optional().default("")
    })

    router.get('/forums/search', validator.query(searchSchema), (req: Request, res: Response) => {
        var page = parseInt(req.query.page as string)
        var count = parseInt(req.query.count as string)
        var nameParts = (req.query.name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
        var descriptionParts = (req.query.name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

        var map = serviceProvider.forum_repository.search(page, count, nameParts, descriptionParts)

        res.json(map).end()
    })

    const createSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional()
    })

    router.post('/forums/create', validator.body(createSchema), (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
        
        var forum = serviceProvider.forum_repository.createForum(req.body.name)
        forum.description = req.body.description

        var forumUser = serviceProvider.forum_user_repository.createUser(user.id, forum.id, "owner")
        forum.owner = forumUser.id

        res.status(201).json({ 
            forum: forum.id,
            forum_user: forumUser.id
        }).end()
    })

    const forumIdQuerySchema = Joi.object({ forum_id: Joi.string().required() })

    router.get('/forums/info', validator.query(forumIdQuerySchema), (req: Request, res: Response) => {
        var forumId = req.query.forum_id as string
        var forum = serviceProvider.forum_repository.getForumById(forumId)

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        res.json(forum).end()
    })

    const createPostSchema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        category: Joi.string().required()
    })

    router.post('/forums/posts/create', validator.query(forumIdQuerySchema), validator.body(createPostSchema), (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)
        
        if (!user)
            throw new UnauthorizedError()

        var forumId = req.query.forum_id as string
        var forum = serviceProvider.forum_repository.getForumById(forumId)

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        requireUserCanAccessForum(serviceProvider, user, forum)

        var title = req.body.title
        var body = req.body.description
        var category = req.body.category

        var post = serviceProvider.post_repository.create(title, body, category, user.id)

        forum.posts.push(post.id)

        res.status(201).json({ post: post.id }).end()
    })
    
    return router
}