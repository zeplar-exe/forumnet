import { ForumID } from "../value_objects.js"
import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"
import { ForumRole } from "./forum_role.js"
import { Post } from "./post.js"
import { Category } from "./category.js"
import { base64uuid } from "../../common/custom_uuid.js"

@Entity()
export class Forum {
    @PrimaryKey({ type: "string" })
    id: ForumID

    @Property()
    name: string

    @Property()
    description: string

    @Property({ type: "datetime" })
    creation_date: Date

    @Property({ nullable: true })
    owner: Rel<ForumUser | undefined>

    @OneToMany("ForumRole", "forum")
    roles: Collection<ForumRole>

    @OneToOne("ForumRole")
    default_role: ForumRole

    @OneToMany("Category", "forum")
    categories: Collection<Category>

    @OneToMany("Post", "forum")
    posts: Collection<Post>

    constructor(name: string, description: string) {
        this.id = base64uuid()
        this.name = name
        this.description = description
        this.creation_date = new Date()
    }
}