import { Post } from "models/post";

export interface PostRepository {
    create(title: any, body: any, id: string): Post;
}

export class PostRepositoryImpl implements PostRepository {
    posts: Array<Post>

    constructor() {
        this.posts = new Array<Post>()
    }

    create(title: string, body: string, author_forum_user_id: string): Post {
        throw new Error("Method not implemented.");
    }   
}