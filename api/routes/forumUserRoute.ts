import { Request, Response, Router } from 'express';
import { ServiceProvider } from "services/service_provider"

export = function(router: Router, serviceProvider: ServiceProvider) {
    router.post('/forum_users/create', (req: Request, res: Response) => {

    })
}