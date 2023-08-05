import { randomUUID } from "crypto"
import { ForumUserID } from "../value_objects"
import { Entity, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { Link } from "./link"
import { User } from "./user"
import { Forum } from "./forum"

@Entity()
export class ForumUser {
    @PrimaryKey({ type: "string" })
    id: ForumUserID

    @OneToOne()
    associated_user: User

    @OneToOne()
    forum: Forum

    @Property()
    display_name: string

    @Property()
    biography: string

    @OneToMany(() => Link, link => link.forum_user_id)
    links: Array<Link>

    constructor(associated_user: User, forum: Forum, display_name: string, biography: string) {
        this.id = randomUUID()
        this.associated_user = associated_user
        this.forum = forum
        this.display_name = display_name
        this.links = new Array<Link>()
    }
}