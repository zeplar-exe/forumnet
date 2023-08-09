import { PostID } from "../value_objects.js"
import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"
import { Forum } from "./forum.js"
import { Category } from "./category.js"
import { base64uuid } from "../../common/custom_uuid.js"

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