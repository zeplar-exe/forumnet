import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider.js"
import { UnauthorizedError } from '../common/http_error.js';
import { orm } from '../index.js';
import { ForumUser } from '../models/entities/forum_user.js';

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/users/me", async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
        
        res.status(200).json(user)
    })

    router.get("/users/me/forum_users", async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
    
        var forumUsers = await orm.em.find(ForumUser, { associated_user: user })

        res.status(200).json(forumUsers ?? [])
    })
    
    return router
}