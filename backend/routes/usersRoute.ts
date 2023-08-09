import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider.js"
import { orm } from '../index.js';
import { ForumUser } from '../models/entities/forum_user.js';
import { requireUserAuthentication } from '../common/authorization.js';

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/users/me", async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        
        res.status(200).json(user)
    })

    router.get("/users/me/forum_users", async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        var forumUsers = await orm.em.find(ForumUser, { associated_user: user })

        res.status(200).json(forumUsers ?? [])
    })
    
    return router
}