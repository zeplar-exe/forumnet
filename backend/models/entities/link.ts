import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ForumUserID } from "models/value_objects";

@Entity()
export class Link {
    @PrimaryKey({ type: "string" })
    forum_user_id: ForumUserID

    @Property()
    link: string
}