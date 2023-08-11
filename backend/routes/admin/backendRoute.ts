import { Request, Response, Router } from 'express';
import { UserRole } from '~/models/enums/user_role.js';
import { ServiceProvider } from "~/services/service_provider.js"
import { requireUserAuthentication, requireUserMeetsRole } from '~/common/authorization.js';

export default function(serviceProvider: ServiceProvider) {
    const router = Router()

    router.get("/admin/backend/config", async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        requireUserMeetsRole(user, UserRole.SiteAdmin)
    })

    router.post("/admin/backedn/config", async (req: Request, res: Response) => {
        var user = await requireUserAuthentication(serviceProvider, req)
        requireUserMeetsRole(user, UserRole.SiteAdmin)
    })

    return router
}