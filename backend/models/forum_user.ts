import { randomUUID } from "crypto"
import { User } from "./user"

export class ForumUser {
    id: string
    associated_user_id: string
    forum_id: string
    display_name: string
    biography: string
    links: Array<string>
    is_owner: boolean

    constructor(associated_user: User, forum_id: string, display_name: string) {
        this.id = randomUUID()
        this.associated_user_id = associated_user.id
        this.forum_id = forum_id
        this.display_name = display_name
        this.links = new Array<string>()
    }
}