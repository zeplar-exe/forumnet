import { Collection, Entity, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { CategoryID } from "models/value_objects.js";
import { Forum } from "./forum.js";
import { Post } from "./post.js";

@Entity()
export class Category {
    @PrimaryKey()
    id: CategoryID

    @Property()
    name: string

    @OneToOne()
    forum: Forum

    @OneToMany(() => Post, post => post.category)
    posts: Collection<Post>

    @ManyToOne({ nullable: true })
    parent_category: Category | null
}