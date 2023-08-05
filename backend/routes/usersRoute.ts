import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { UnauthorizedError } from '../common/http_error';
import { orm } from 'db';
import { ForumUser } from 'models/entities/forum_user';

export = function(serviceProvider: ServiceProvider) {
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