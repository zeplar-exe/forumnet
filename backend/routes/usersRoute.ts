import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { UnauthorizedError } from '../common/http_error';

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/users/me", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
    
        res.status(200).json(user)
    })

    router.get("/users/forum_users", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
    
        res.status(200).json(serviceProvider.forum_user_repository.getUsersByAssociated(user.id))
    })
    
    return router
}