import { randomUUID } from "crypto"
import { ForumID } from "./value_objects"

export class Forum {
    id: ForumID
    name: string
    description: string
    creation_date: Date
    posts: Array<string>
    owner: string | undefined

    constructor(name: string) {
        this.id = randomUUID()
        this.name = name
        this.description = ""
        this.posts = new Array<string>()
        this.creation_date = new Date()
    }
}