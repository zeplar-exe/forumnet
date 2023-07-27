import { Request, Response, Router } from 'express';
import { Forum } from 'models/forum';
import { ServiceProvider } from "services/service_provider"

export = function(router: Router, serviceProvider: ServiceProvider) {
    router.post('/forums/create', (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)

        if (!user)
            return res.status(403).end()
        
        var forum = new Forum(req.body.name)

        serviceProvider.forum_repository.add(forum)
    })
}