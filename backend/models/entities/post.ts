import { PostID } from "../value_objects.js"
import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"
import { Forum } from "./forum.js"
import { Category } from "./category.js"
import { base64uuid } from "~/common/custom_uuid.js"

export const POST_TITLE_MIN_LENGTH = 12
export const POST_TITLE_MAX_LENGTH = 140
export const POST_BODY_MIN_LENGTH = 10
export const POST_BODY_MAX_LENGTH = 20000 // ~3500 words, ~14 pages

@Entity()
export class Post {
    @PrimaryKey({ type: "string" })
    id: PostID

    @Property()
    title: string

    @Property()
    body: string

    @ManyToOne("Category")
    category: Rel<Category>

    @ManyToOne("Forum")
    forum: Rel<Forum>

    @ManyToOne("ForumUser")
    author: Rel<ForumUser>

    @Property()
    hidden: boolean

    @Property({ type: "datetime" })
    creation_date: Date

    constructor(title: string, body: string, category: Category, forum: Forum, author: ForumUser) {
        this.id = base64uuid()
        this.title = title
        this.body = body
        this.category = category
        this.forum = forum
        this.author = author
        this.hidden = false
        this.creation_date = new Date()
    }
}