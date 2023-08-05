import { randomUUID } from "crypto"
import { CategoryName, PostID } from "../value_objects"
import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { ForumUser } from "./forum_user"
import { Forum } from "./forum"

@Entity()
export class Post {
    @PrimaryKey({ type: "string" })
    id: PostID

    @Property()
    title: string

    @Property()
    body: string

    @Property({ type: "string" })
    category: CategoryName

    @OneToOne()
    forum: Forum

    @ManyToOne()
    author: ForumUser

    @Property({ type: "datetime" })
    creation_date: Date

    constructor(title: string, body: string, category: CategoryName, forum: Forum, author: ForumUser) {
        this.id = randomUUID()
        this.title = title
        this.body = body
        this.category = category
        this.forum = forum
        this.author = author
        this.creation_date = new Date()
    }
}