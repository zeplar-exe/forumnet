import { randomUUID } from "crypto"
import { ForumID, ForumUserID } from "./value_objects"

export class Forum {
    id: ForumID
    name: string
    description: string
    creation_date: Date
    owner: ForumUserID | undefined

    constructor(name: string) {
        this.id = randomUUID()
        this.name = name
        this.description = ""
        this.creation_date = new Date()
    }
}