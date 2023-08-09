import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { Forum } from "./forum.js"
import { ForumUser } from "./forum_user.js"

@Entity()
export default class ForumRole {
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

    @OneToMany(() => ForumUser, user => user.role)
    forum_users: Collection<ForumUser>

    @Property()
    can_view_posts: boolean

    @Property()
    can_view_replies: boolean

    @Property()
    can_post: boolean

    @Property()
    can_reply: boolean

    @Property()
    can_hide_post: boolean

    @Property()
    can_hide_reply: boolean
} 