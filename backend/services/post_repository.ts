import { CategoryName, ForumUserID, PostID, UserID } from "models/value_objects";
import { Post } from "../models/post";

export interface PostRepository {
    create(title: any, body: any, category: CategoryName, author_forum_user_id: ForumUserID): Post;
    getPostById(post_id: PostID): Post | undefined;
    search(page: number, count: number, title: string, body: string): Map<number, PostID>;
}

export class PostRepositoryImpl implements PostRepository {
    posts: Array<Post>

    constructor() {
        this.posts = new Array<Post>()
    }

    create(title: string, body: string, category: CategoryName, author_forum_user_id: ForumUserID): Post {
        var post = new Post(title, body, category, author_forum_user_id)

        this.posts.push(post)

        return post
    }

    getPostById(post_id: PostID): Post | undefined {
        return this.posts.find(p => p.id == post_id)
    }

    search(page: number, count: number, title: string, body: string): Map<number, string> {
        var nameParts = (title as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
        var descriptionParts = (body as string).split(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)

        var map = new Map<number, string>()

        this.posts.forEach(post => {
            var nameCount = 0
            var descriptionCount = 0;

            nameParts.forEach(namePart => {
                if (post.title.includes(namePart))
                    nameCount += 1
            });

            descriptionParts.forEach(descriptionPart => {
                if (post.body.includes(descriptionPart))
                    descriptionCount += 1
            });

            map[nameCount + descriptionCount] = post.id
        });

        return map
    }
}