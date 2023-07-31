import { UnauthorizedError } from '../common/http_error';
import { Request, Response, Router } from 'express';
import { UserRole } from '../models/user_role';
import { ServiceProvider } from "../services/service_provider"

export = function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.post("/api/start_lockdown", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)
        
        if (!user || user.role < UserRole.SiteAdmin)
            throw new UnauthorizedError()

        serviceProvider.api.setLockdownStatus(true)
    })

    router.post("/api/end_lockdown", (req: Request, res: Response) => {
        var user = serviceProvider.auth.authenticate(req)
        
        if (!user || user.role < UserRole.SiteAdmin)
            throw new UnauthorizedError()

        serviceProvider.api.setLockdownStatus(false)
    })

    return router
}