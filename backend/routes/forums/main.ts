import { requireUserAuthentication } from "~/common/authorization.js"
import { createLocationUrl } from "~/common/location.js"
import { Router, Request, Response } from "express"
import { createValidator } from "express-joi-validation"
import { orm } from "~/index.js"
import Joi from "joi"
import { Forum } from "~/models/entities/forum.js"
import { ForumUser } from "~/models/entities/forum_user.js"
import { ServiceProvider } from "~/services/service_provider.js"
import { BadRequestError } from "~/common/http_error.js"

const validator = createValidator()

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    const searchSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        count: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().required().min(3).max(32),
        description: Joi.string().optional().default("").max(2000)
    })

    router.get('/search/', validator.query(searchSchema), async (req: Request, res: Response) => {
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

    router.post('/create/', validator.body(createSchema), async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        
        var forum = new Forum(req.body.name, req.body.description)
        var owner = new ForumUser(user, forum, forum.default_role, "Owner", "")
        forum.owner = owner
        owner.role = forum.default_role
        
        orm.em.persist(forum)
        orm.em.persist(forum.default_role)

        await orm.em.flush()

        res.status(201)
            .setHeader("Location", `${createLocationUrl(req)}/forums/${forum.id}`)
            .json({ 
                forum: forum,
                forum_user: owner
            })
    })

    router.get('/:forum_id/', async (req: Request, res: Response) => {
        var forum = await orm.em.findOne(Forum, { id: req.params.forum_id })

        if (!forum)
            throw new BadRequestError("The given forum does not exist.")

        res.status(200).json(forum)
    })

    return router
}