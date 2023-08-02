import { Forum } from "../models/forum";
import { User } from "../models/user";
import { ServiceProvider } from "../services/service_provider";
import { UnauthorizedError } from "./http_error";

export function requireUserCanAccessForum(serviceProvider: ServiceProvider, user: User, forum: Forum) {
    var forumUser = serviceProvider.forum_user_repository.getUsersByAssociated(user.id).find(u => u.forum_id == forum.id)

    if (!forumUser)
        throw new UnauthorizedError("The authenticated user does not have access to the given forum.")

    return forumUser
}