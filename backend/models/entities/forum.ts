import { randomUUID } from "crypto"
import { ForumID } from "../value_objects.js"
import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"

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

    @ManyToOne(() => ForumUser, { nullable: true })
    owner: Rel<ForumUser | undefined>

    constructor(name: string, description: string) {
        this.id = randomUUID()
        this.name = name
        this.description = description
        this.creation_date = new Date()
    }
}