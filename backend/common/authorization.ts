import { User } from "../models/entities/user.js";
import { ForbiddenError, UnauthorizedError } from "./http_error.js";
import { UserRole } from "../models/enums/user_role.js";
import { Request } from "express"
import { ServiceProvider } from "services/service_provider.js";

export async function requireUserAuthentication(serviceProvider: ServiceProvider, request: Request) : Promise<User> {
    var user = await serviceProvider.auth.authenticate(request)

    if (!user)
        throw new UnauthorizedError()

    return user
}

export function requireUserMeetsRole(user: User, role: UserRole) {
    if (user.role < role)
        throw new ForbiddenError()
}