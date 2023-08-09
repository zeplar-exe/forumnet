import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { CategoryID } from "../../models/value_objects.js";
import { Forum } from "./forum.js";
import { Post } from "./post.js";

@Entity()
export class Category {
    @PrimaryKey()
    id: CategoryID

    @Property()
    name: string

    @ManyToOne("Forum")
    forum: Rel<Forum>

    @OneToMany("Post", "category")
    posts: Collection<Post>

    @ManyToOne("Category", { nullable: true })
    parent_category: Category | null
}