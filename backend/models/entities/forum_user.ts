import { ForumUserID } from "../value_objects.js"
import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { User } from "./user.js"
import { Forum } from "./forum.js"
import ForumRole from "./forum_role.js"
import { base64uuid } from "../../common/custom_uuid.js"

@Entity()
export class ForumUser {
    @PrimaryKey({ type: "string" })
    id: ForumUserID

    @ManyToOne()
    associated_user: User

    @OneToOne(() => Forum)
    forum: Rel<Forum>

    @ManyToOne()
    role: ForumRole

    @Property()
    display_name: string

    @Property()
    biography: string

    constructor(associated_user: User, forum: Forum, display_name: string, biography: string) {
        this.id = base64uuid()
        this.associated_user = associated_user
        this.forum = forum
        this.display_name = display_name
        this.biography = biography
    }
}