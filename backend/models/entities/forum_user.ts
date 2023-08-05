import { randomUUID } from "crypto"
import { ForumUserID } from "../value_objects.js"
import { Entity, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { User } from "./user.js"
import { Forum } from "./forum.js"

@Entity()
export class ForumUser {
    @PrimaryKey({ type: "string" })
    id: ForumUserID

    @OneToOne()
    associated_user: User

    @OneToOne(() => Forum)
    forum: Rel<Forum>

    @Property()
    display_name: string

    @Property()
    biography: string

    @Property()
    links: string

    constructor(associated_user: User, forum: Forum, display_name: string, biography: string) {
        this.id = randomUUID()
        this.associated_user = associated_user
        this.forum = forum
        this.display_name = display_name
        this.biography = biography
        this.links = ""
    }
}