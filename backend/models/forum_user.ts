import { randomUUID } from "crypto"
import { ForumID, ForumUserID, UserID } from "./value_objects"

export class ForumUser {
    id: ForumUserID
    associated_user_id: UserID
    forum_id: ForumID
    display_name: string
    biography: string
    links: Array<string>

    constructor(associated_user_id: UserID, forum_id: ForumID, display_name: string) {
        this.id = randomUUID()
        this.associated_user_id = associated_user_id
        this.forum_id = forum_id
        this.display_name = display_name
        this.links = new Array<string>()
    }
}