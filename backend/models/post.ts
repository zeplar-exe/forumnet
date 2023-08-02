import { randomUUID } from "crypto"
import { CategoryName, ForumUserID, PostID } from "./value_objects"

export class Post {
    id: PostID
    title: string
    body: string
    category: CategoryName
    author_forum_user_id: ForumUserID
    creation_date: Date

    constructor(title: string, body: string, category: CategoryName, author_forum_user_id: ForumUserID) {
        this.id = randomUUID()
        this.title = title
        this.body = body
        this.category = category
        this.author_forum_user_id = author_forum_user_id
        this.creation_date = new Date()
    }
}