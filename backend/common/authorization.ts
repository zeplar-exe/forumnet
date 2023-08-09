import { Forum } from "../models/entities/forum.js";
import { User } from "../models/entities/user.js";
import { ForbiddenError, UnauthorizedError } from "./http_error.js";
import { ForumUser } from "../models/entities/forum_user.js";
import { orm } from "../index.js";
import { UserRole } from "../models/enums/user_role.js";
import { Request } from "express"
import { ServiceProvider } from "services/service_provider.js";

export async function requireUserCanAccessForum(user: User, forum: Forum): Promise<ForumUser> {
    var forumUser = await orm.em.findOne(ForumUser, { associated_user: user, forum: forum })

    if (!forumUser)
        throw new UnauthorizedError("The authenticated user does not have access to the given forum.")

    return forumUser
}

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