import { randomUUID } from "crypto"

export class ForumUser {
    id: string
    associated_user_id: string
    forum_id: string
    display_name: string
    biography: string
    links: Array<string>

    constructor(associated_user_id: string, forum_id: string, display_name: string) {
        this.id = randomUUID()
        this.associated_user_id = associated_user_id
        this.forum_id = forum_id
        this.display_name = display_name
        this.links = new Array<string>()
    }
}