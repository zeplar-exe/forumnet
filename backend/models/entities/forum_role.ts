import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { Forum } from "./forum.js"
import { ForumUser } from "./forum_user.js"
import { base64uuid } from "~/common/custom_uuid.js"

@Entity()
export class ForumRole {
    @PrimaryKey()
    id: string

    @Property()
    name: string

    @Property()
    description: string

    @ManyToOne("Forum")
    forum: Rel<Forum>

    @Property({ type: "int" })
    precedence: number

    @OneToMany("ForumUser", "role")
    forum_users: Collection<ForumUser>

    @Property({ type: "datetime" })
    creation_date: Date

    @Property()
    can_view_posts: boolean

    @Property()
    can_view_replies: boolean

    @Property()
    can_post: boolean

    @Property()
    can_reply: boolean

    @Property()
    can_hide_own_post: boolean

    @Property()
    can_hide_own_reply: boolean

    @Property()
    can_hide_other_post: boolean

    @Property()
    can_hide_other_reply: boolean

    @Property()
    can_change_own_post_category: boolean

    @Property()
    can_change_other_post_category: boolean

    constructor(name: string, description: string, forum: Rel<Forum>, precedence: number) {
        this.id = base64uuid()
        this.name = name
        this.description = description
        this.forum = forum
        this.precedence = precedence
        this.creation_date = new Date()
    }
} 