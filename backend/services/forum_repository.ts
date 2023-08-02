import { ForumID } from "models/value_objects";
import { Forum } from "../models/forum";

export interface ForumRepository {
    search(page: number, count: number, name: string, description: string): void;
    createForum(name: string): Forum
    getForumById(id: string): Forum | undefined
}

export class ForumRepositoryImpl implements ForumRepository {
    forums: Array<Forum>

    constructor() {
        this.forums = new Array<Forum>()
    }

    createForum(name: string): Forum {
        var forum = new Forum(name)

        this.forums.push(forum)

        return forum
    }

    getForumById(id: ForumID): Forum | undefined {
        return this.forums.find(forum => forum.id == id)
    }

    search(page: number, count: number, name: string, description: string): Map<number, ForumID> {
        var nameParts = (name as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
        var descriptionParts = (description as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

        var map = new Map<number, ForumID>()

        this.forums.forEach(forum => {
            var nameCount = 0
            var descriptionCount = 0;

            nameParts.forEach(namePart => {
                if (forum.name.includes(namePart))
                    nameCount += 1
            });

            descriptionParts.forEach(descriptionPart => {
                if (forum.description.includes(descriptionPart))
                    descriptionCount += 1
            });

            map[nameCount + descriptionCount] = forum.id
        });

        return map
    }
}