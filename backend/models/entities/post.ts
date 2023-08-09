import { randomUUID } from "crypto"
import { PostID } from "../value_objects.js"
import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"
import { Forum } from "./forum.js"
import { Category } from "./category.js"

@Entity()
export class Post {
    @PrimaryKey({ type: "string" })
    id: PostID

    @Property()
    title: string

    @Property()
    body: string

    @OneToOne()
    category: Category

    @OneToOne()
    forum: Forum

    @ManyToOne()
    author: ForumUser

    @Property()
    hidden: boolean

    @Property({ type: "datetime" })
    creation_date: Date

    constructor(title: string, body: string, category: Category, forum: Forum, author: ForumUser) {
        this.id = randomUUID()
        this.title = title
        this.body = body
        this.category = category
        this.forum = forum
        this.author = author
        this.hidden = false
        this.creation_date = new Date()
    }
}