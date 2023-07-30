import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"
import { UnauthorizedError } from '../common/http_error';

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/users/me", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            throw new UnauthorizedError()
    
        res.json(user).end()
    })
    
    return router
}