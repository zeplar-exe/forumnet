import { randomUUID } from "crypto"

export class Forum {
    id: string
    name: string
    description: string
    creation_date: Date
    categories: Array<string>

    constructor(name: string) {
        this.id = randomUUID()
        this.name = name
        this.description = ""
        this.creation_date = new Date()
        this.categories = new Array<string>()
    }
}