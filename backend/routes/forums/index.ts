import { Router } from "express"
import { ServiceProvider } from "~/services/service_provider.js"

import main from "./main.js"
import posts from "./posts.js"
import { UnauthorizedError } from "~/common/http_error.js"
import { orm } from "~/index.js"
import { Forum } from "~/models/entities/forum.js"
import { ForumUser } from "~/models/entities/forum_user.js"
import { User } from "~/models/entities/user.js"

export async function requireUserCanAccessForum(user: User, forum: Forum): Promise<ForumUser> {
    var forumUser = await orm.em.findOne(ForumUser, { associated_user: user, forum: forum })

    if (!forumUser)
        throw new UnauthorizedError("The authenticated user does not have access to the given forum.")

    return forumUser
}

export default function(serviceProvider: ServiceProvider) {
    const router = Router()    

    router.use("/forums/", main(serviceProvider))
    router.use("/forums/", posts(serviceProvider))

    return router
}