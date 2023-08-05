import { randomUUID } from "crypto"
import { ForumID } from "../value_objects"
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { ForumUser } from "./forum_user"

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

    @ManyToOne()
    owner: ForumUser | undefined

    constructor(name: string, description: string) {
        this.id = randomUUID()
        this.name = name
        this.description = description
        this.creation_date = new Date()
    }
}