import { requireUserAuthentication } from "~/common/authorization.js"
import { BadRequestError, ForbiddenError, ServiceLayerError } from "~/common/http_error.js"
import { Router, Request, Response } from "express"
import { createValidator } from "express-joi-validation"
import { orm } from "~/index.js"
import Joi from "joi"
import { Forum } from "~/models/entities/forum.js"
import { POST_BODY_MAX_LENGTH, POST_BODY_MIN_LENGTH, POST_TITLE_MAX_LENGTH, POST_TITLE_MIN_LENGTH, Post } from "~/models/entities/post.js"
import { ServiceProvider } from "~/services/service_provider.js"
import { requireUserCanAccessForum } from "./index.js"
import { Category } from "~/models/entities/category.js"

const validator = createValidator()

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    const searchPostsSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        title: Joi.string().required(),
        body: Joi.string().optional().default("")
    })

    router.get('/:forum_id/posts/search/',
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
        title: Joi.string().required().min(POST_TITLE_MIN_LENGTH).max(POST_TITLE_MAX_LENGTH),
        body: Joi.string().required().min(POST_BODY_MIN_LENGTH).max(POST_BODY_MAX_LENGTH),
        category: Joi.string().required()
    })

    router.post('/:forum_id/posts/create/', validator.body(createPostSchema), async (req: Request, res: Response) => {
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

    router.get('/:forum_id/posts/:post_id/', async (req: Request, res: Response) => {
        var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })
        var post = await orm.em.findOne(Post, { id: req.params.post_id, forum })

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        res.status(200).json(post)
    })

    const editPostSchema = Joi.object({
        title: Joi.string().optional().min(12).max(140).default(undefined),
        body: Joi.string().optional().min(50).max(40000).default(undefined),
        category: Joi.string().optional().default(undefined)
    })

    router.patch('/:forum_id/posts/:post_id/', validator.body(editPostSchema), async (req: Request, res: Response) => {
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