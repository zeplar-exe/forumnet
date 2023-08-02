import { randomUUID } from "crypto"

export class Post {
    id: string
    title: string
    body: string
    category_id: string
    author_forum_user_id: string
    creation_date: Date

    constructor(title: string, body: string, category_id: string, author_forum_user_id: string) {
        this.id = randomUUID()
        this.title = title
        this.body = body
        this.category_id = category_id
        this.author_forum_user_id = author_forum_user_id
        this.creation_date = new Date()
    }
}