import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { CategoryID } from "~/models/value_objects.js";
import { Forum } from "./forum.js";
import { Post } from "./post.js";
import { base64uuid } from "~/common/custom_uuid.js";

@Entity()
export class Category {
    @PrimaryKey()
    id: CategoryID

    @Property()
    name: string

    @Property()
    description: string

    @ManyToOne("Forum")
    forum: Rel<Forum>

    @OneToMany("Post", "category")
    posts: Collection<Post>

    @ManyToOne("Category", { nullable: true })
    parent_category: Rel<Category | null>

    constructor(name: string, description: string, forum: Forum, parent_category: Category | null = null) {
        this.id = base64uuid()
        this.name = name
        this.description = description
        this.forum = forum
        this.posts = new Collection<Post>(this)
        this.parent_category = parent_category
    }
}