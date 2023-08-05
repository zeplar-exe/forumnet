import { UnauthorizedError } from '../../common/http_error.js';
import { Request, Response, Router } from 'express';
import { UserRole } from '../../models/enums/user_role.js';
import { ServiceProvider } from "../../services/service_provider.js"

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.post("/admin/api/start_lockdown", async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)
        
        if (!user || user.role < UserRole.SiteAdmin)
            throw new UnauthorizedError()

        serviceProvider.api.setLockdownStatus(true)
    })

    router.post("/admin/api/end_lockdown", async (req: Request, res: Response) => {
        var user = await serviceProvider.auth.authenticate(req)
        
        if (!user || user.role < UserRole.SiteAdmin)
            throw new UnauthorizedError()

        serviceProvider.api.setLockdownStatus(false)
    })

    return router
}