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
        var name = req.query.name as string
        var description = req.query.description as string

        var map = serviceProvider.forum_repository.search(page, count, name, description)

        res.status(200).json(map)
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

        res.status(201)
            .setHeader("Location", `/forums/${forum.id}`)
            .json({ 
                forum: forum.id,
                forum_user: forumUser.id
            })
    })

    router.get('/forums/:forum_id', (req: Request, res: Response) => {
        var forumId = req.params.forum_id
        var forum = serviceProvider.forum_repository.getForumById(forumId)

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        res.status(200).json(forum)
    })

    const searchPostsSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        title: Joi.string().required(),
        body: Joi.string().optional().default("")
    })

    router.get('/forums/:forum_id/posts/search',
        validator.body(searchPostsSchema), 
        (req: Request, res: Response) => {
            var forum = serviceProvider.forum_repository.getForumById(req.params.forum_id)

            if (!forum)
                throw new BadRequestError("The given forum does not exist.")

            var page = parseInt(req.query.page as string)
            var count = parseInt(req.query.count as string)
            var title = req.query.title as string
            var body = req.query.body as string

            var map = serviceProvider.post_repository.search(page, count, forum.id, title, body)

            res.status(200).json(map)
        })

    const createPostSchema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        category: Joi.string().required()
    })

    router.post('/forums/:forum_id/posts/create', validator.body(createPostSchema), (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)
        
        if (!user)
            throw new UnauthorizedError()

        var forumId = req.params.forum_id
        var forum = serviceProvider.forum_repository.getForumById(forumId)

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        requireUserCanAccessForum(serviceProvider, user, forum)

        var title = req.body.title
        var body = req.body.description
        var category = req.body.category

        var post = serviceProvider.post_repository.create(title, body, category, forumId, user.id)

        res.status(201)
            .setHeader("Location", `/forums/${forum.id}/posts/${post.id}`)
            .json({ post: post.id })
    })

    router.get('/forums/:forum_id/posts/:post_id', (req: Request, res: Response) => {
        var postId = req.params.post_id
        var post = serviceProvider.post_repository.getPostById(postId)

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        res.status(200).json(post)
    })
    
    return router
}