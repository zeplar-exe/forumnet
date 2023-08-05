import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { BadRequestError, UnauthorizedError } from '../common/http_error';
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { requireUserCanAccessForum } from '../common/authorization';
import { Forum } from '../models/entities/forum';
import { ForumUser } from '../models/entities/forum_user';
import { orm } from 'db';
import { createLocationUrl } from '../common/location';
import { Post } from '../models/entities/post';

const validator = createValidator({})

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    const searchSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().required(),
        description: Joi.string().optional().default("")
    })

    router.get('/forums/search', validator.query(searchSchema), async (req: Request, res: Response) => {
        var page = parseInt(req.query.page as string)
        var count = parseInt(req.query.count as string)
        var name = req.query.name as string
        var description = req.query.description as string

        var nameParts = (name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
        var descriptionParts = (description as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

        var results = await orm.em.find(Forum, 
            {
                name: { $contains: nameParts }, 
                description: { $contains: descriptionParts }
            }, 
            { 
                limit: count,
                offset: page * count
            })

        res.status(200).json(results)
    })

    const createSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional().default("")
    })

    router.post('/forums/create', validator.body(createSchema), async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
        
        var forum = new Forum(req.body.name, req.body.description)
        var forumUser = new ForumUser(user, forum, "owner", "")
        forum.owner = forumUser

        orm.em.persistAndFlush(forum)
        orm.em.persistAndFlush(forumUser)

        res.status(201)
            .setHeader("Location", `${createLocationUrl(req)}/forums/${forum.id}`)
            .json({ 
                forum: forum,
                forum_user: forumUser
            })
    })

    router.get('/forums/:forum_id', async (req: Request, res: Response) => {
        var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })

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
        async (req: Request, res: Response) => {
            var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })

            if (!forum)
                throw new BadRequestError("The given forum does not exist.")

            var page = parseInt(req.query.page as string)
            var count = parseInt(req.query.count as string)
            var title = req.query.title as string
            var body = req.query.body as string

            var titleParts = (title as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
            var bodyParts = (body as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

            var results = await orm.em.find(Post, 
                {
                    title: { $contains: titleParts }, 
                    body: { $contains: bodyParts }
                }, 
                { 
                    limit: count,
                    offset: page * count
                })

            res.status(200).json(results)
        })

    const createPostSchema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        category: Joi.string().required()
    })

    router.post('/forums/:forum_id/posts/create', validator.body(createPostSchema), async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)
        
        if (!user)
            throw new UnauthorizedError()

        var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        var forumUser = await requireUserCanAccessForum(user, forum)

        var title = req.body.title
        var body = req.body.description
        var category = req.body.category

        var post = new Post(title, body, category, forum, forumUser)

        await orm.em.persistAndFlush(post)

        res.status(201)
            .setHeader("Location", `/forums/${forum.id}/posts/${post.id}`)
            .json({ post: post.id })
    })

    router.get('/forums/:forum_id/posts/:post_id', async (req: Request, res: Response) => {
        var post = await orm.em.findOne(Post, { id: req.params.post_id })

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        res.status(200).json(post)
    })
    
    return router
}