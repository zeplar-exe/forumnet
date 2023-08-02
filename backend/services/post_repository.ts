import { Post } from "../models/post";

export interface PostRepository {
    create(title: any, body: any, category: string, author_forum_user_id: string): Post;
}

export class PostRepositoryImpl implements PostRepository {
    posts: Array<Post>

    constructor() {
        this.posts = new Array<Post>()
    }

    create(title: string, body: string, category_id: string, author_forum_user_id: string): Post {
        var post = new Post(title, body, category_id, author_forum_user_id)

        this.posts.push(post)

        return post
    }   
}