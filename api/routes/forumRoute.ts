import { Request, Response, Router } from 'express';
import { Forum } from '../models/forum';
import { ServiceProvider } from "../services/service_provider"

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.post('/forums/create', (req: Request, res: Response) => {
        if (!serviceProvider.auth.authenticate(req)) 
            throw new UnauthorizedError()
        
        var forum = new Forum(req.body.name)

        serviceProvider.forum_repository.add(forum)
    })
    
    return router
}