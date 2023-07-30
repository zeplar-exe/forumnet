import { Request, Response, Router } from 'express';
import { ServiceProvider } from "../services/service_provider"

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.post('/forum_users/create', (req: Request, res: Response) => {

    })
    
    return router
}