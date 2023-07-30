import { ForumUser } from "../models/forum_user";
import { User } from "../models/user";

export interface ForumUserRepository {
    createUser(associated_user: User, forum_id: string, display_name: string): ForumUser
    getUserById(id: string): ForumUser | undefined
    getUsersByAssociated(associated_user_id: string): Array<ForumUser> | undefined
    getUsersByForumId(forum_id: string): Array<ForumUser> | undefined
}

export class ForumUserRepositoryImpl implements ForumUserRepository {
    users: Array<ForumUser>

    constructor() {
        this.users = new Array<ForumUser>()
    }

    createUser(associated_user: User, forum_id: string, display_name: string): ForumUser {
        var user = new ForumUser(associated_user, forum_id, display_name)

        this.users.push(user)

        return user
    }

    getUserById(id: string): ForumUser | undefined {
        return this.users.find(user => user.id == id)
    }

    getUsersByAssociated(associated_user_id: string): Array<ForumUser> | undefined {
        return this.users.filter((user) => user.associated_user_id == associated_user_id)
    }

    getUsersByForumId(forum_id: string): Array<ForumUser> | undefined {
        return this.users.filter((user) => user.forum_id == forum_id)
    }
}