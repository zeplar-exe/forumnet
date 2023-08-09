import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider.js"
import { BadRequestError, ForbiddenError } from '../common/http_error.js';
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { requireUserAuthentication, requireUserCanAccessForum } from '../common/authorization.js';
import { Forum } from '../models/entities/forum.js';
import { Post } from '../models/entities/post.js';
import { orm } from '../index.js';

const validator = createValidator()

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    const patchPostSchema = Joi.object({
        title: Joi.string().optional().min(12).max(140),
        body: Joi.string().optional().min(50).max(40000)
    })

    router.patch("/posts/:post_id", validator.body(patchPostSchema), async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        var post = await orm.em.findOne(Post, { id: req.params.post_id })

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        if (post.author.associated_user !== user)
            throw new ForbiddenError("You are not the author of the given post.")
        
        post.title = req.body.title
        post.body = req.body.body

        orm.em.persistAndFlush(post)

        res.status(200).json(post)
    })

    router.get('/posts/:post_id', async (req: Request, res: Response) => {
        var post = await orm.em.findOne(Post, { id: req.params.post_id })

        if (!post)
            throw new BadRequestError("The given post does not exist.")

        res.status(200).json(post)
    })
    
    return router
}