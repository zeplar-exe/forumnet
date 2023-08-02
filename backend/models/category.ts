import { randomUUID } from "crypto"

export class Category {
    id: string
    name: string
    description: string
    sub_categories: Array<string>
    posts: Array<string>
    creation_date: Date

    constructor(name: string, description: string) {
        this.id = randomUUID()
        this.name = name
        this.description = description
        this.sub_categories = new Array<string>()
        this.posts = new Array<string>()
        this.creation_date = new Date()
    }
}