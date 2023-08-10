import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider.js"
import { BadRequestError, ForbiddenError, InternalError, ServiceLayerError, UnauthorizedError } from '../common/http_error.js';
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { requireUserAuthentication } from '../common/authorization.js';
import { Forum } from '../models/entities/forum.js';
import { ForumUser } from '../models/entities/forum_user.js';
import { createLocationUrl } from '../common/location.js';
import { Post } from '../models/entities/post.js';
import { orm } from '../index.js';
import { ForumRole } from '../models/entities/forum_role.js';
import { Category } from '../models/entities/category.js';
import { User } from '../models/entities/user.js';

const validator = createValidator({})

export default function(serviceProvider: ServiceProvider) {
    async function requireUserCanAccessForum(user: User, forum: Forum): Promise<ForumUser> {
        var forumUser = await orm.em.findOne(ForumUser, { associated_user: user, forum: forum })
    
        if (!forumUser)
            throw new UnauthorizedError("The authenticated user does not have access to the given forum.")
    
        return forumUser
    }

    const router = Router()

    const searchSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().required().min(3).max(32),
        description: Joi.string().optional().default("").max(2000)
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
        var user = await requireUserAuthentication(serviceProvider, req)
        
        var forum = new Forum(req.body.name, req.body.description)
        var defaultRole = new ForumRole("Default", "The default role.", forum, 0);
        var forumUser = new ForumUser(user, forum, defaultRole, "Owner", "")
        forum.owner = forumUser
        forum.default_role = defaultRole

        orm.em.persist(forum)
        orm.em.persist(defaultRole)
        orm.em.persist(forumUser)

        orm.em.flush()

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
        title: Joi.string().required().min(12).max(140),
        body: Joi.string().required().min(50).max(40000),
        category: Joi.string().required()
    })

    router.post('forums/:forum_id/posts/create', validator.body(createPostSchema), async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
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

    const editPostSchema = Joi.object({
        title: Joi.string().optional().min(12).max(140).default(undefined),
        body: Joi.string().optional().min(50).max(40000).default(undefined),
        category: Joi.string().optional().default(undefined)
    })

    router.patch('forums/:forum_id/posts/:post_id', validator.body(editPostSchema), async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        var post = await orm.em.findOne(Post, { id: req.params.post_id })

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        var tasks = [
            async (): Promise<void> => {
                if (req.body.title) {
                    if (post!.author.associated_user !== user)
                        throw new ForbiddenError("Insufficient permissions to change post title.")

                    post!.title = req.body.title
                }
            },
            async (): Promise<void> => {
                if (req.body.body) {
                    if (post!.author.associated_user !== user)
                        throw new ForbiddenError("Insufficient permissions to change post title.")

                    post!.body = req.body.body
                }
            },
            async (): Promise<void> => {
                if (req.body.category) {
                    if (post!.author.associated_user === user) {
                        if (!post!.author.role.can_change_own_post_category)
                            throw new ForbiddenError("Insufficient permissions to change post category.")
                    } else {
                        if (!post!.author.role.can_change_other_post_category)
                            throw new ForbiddenError("Insufficient permissions to change post category.")
                    }

                    var category = await orm.em.findOne(Category, { id: req.body.category })

                    if (!category)
                        throw new BadRequestError("The given category does not exist.")

                    if (category.forum !== forum)
                        throw new BadRequestError("The given category must be in the same forum.")

                    post!.category = category
                }
            }
        ]

        type TaskResult = {
            status: number,
            message: string
        } | {
            status: number
        }

        var result = new Array<TaskResult>()

        tasks.forEach(async (func) => {
            try {
                func()

                result.push({ status: 200 })
            } catch (error) {
                if (error instanceof ServiceLayerError)
                    result.push({ status: error.status, message: error.message })

                throw error
            }
        })

        res.status(207).json(result)
    })
    
    return router
}