import { ForumID, ForumUserID, UserID } from "models/value_objects";
import { ForumUser } from "../models/forum_user";

export interface ForumUserRepository {
    createUser(associated_user_id: UserID, forum_id: ForumID, display_name: string): ForumUser
    getUserById(id: ForumUserID): ForumUser | undefined
    getUsersByAssociated(associated_user_id: UserID): Array<ForumUser>
    getUsersByForumId(forum_id: ForumID): Array<ForumUser>
}

export class ForumUserRepositoryImpl implements ForumUserRepository {
    users: Array<ForumUser>

    constructor() {
        this.users = new Array<ForumUser>()
    }

    createUser(associated_user_id: UserID, forum_id: ForumID, display_name: string): ForumUser {
        var user = new ForumUser(associated_user_id, forum_id, display_name)

        this.users.push(user)

        return user
    }

    getUserById(id: ForumUserID): ForumUser | undefined {
        return this.users.find(user => user.id == id)
    }

    getUsersByAssociated(associated_user_id: UserID): Array<ForumUser> {
        return this.users.filter((user) => user.associated_user_id == associated_user_id)
    }

    getUsersByForumId(forum_id: ForumID): Array<ForumUser> {
        return this.users.filter((user) => user.forum_id == forum_id)
    }
}