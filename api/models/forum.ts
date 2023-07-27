import { ForumConfiguration } from "./forum_configuration"

export class Forum {
    id: string
    name: string
    description: string | null
    configuration: ForumConfiguration
    creation_date: Date

    constructor(name: string) {
        this.id = crypto.randomUUID()
        this.name = name
        this.configuration = new ForumConfiguration()
        this.creation_date = new Date()
    }
}