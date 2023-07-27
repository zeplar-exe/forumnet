import { Forum } from "models/forum";

export interface ForumRepository {
    add(forum: Forum): void
}

export class ForumRepositoryImpl implements ForumRepository {
    add(forum: Forum) {
        
    }
}