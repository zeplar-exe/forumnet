import { HashedPassword } from "../../common/hashed_password.js"
import { UserRole } from "../enums/user_role.js"
import { UserID, UserIdentifier } from "../value_objects.js"
import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { ForumUser } from "./forum_user.js"
import { base64uuid } from "../../common/custom_uuid.js"

@Entity()
export class User {
    @PrimaryKey({ type: "string" })
    id: UserID

    @Property({ type: "string" })
    identifier: UserIdentifier
    
    @Property({ type: "string" })
    password: HashedPassword

    @Enum()
    role: UserRole

    @OneToMany("ForumUser", "associated_user")
    forum_users: Collection<ForumUser>
    
    constructor(identifier: UserIdentifier, password: HashedPassword, role: UserRole) {
        this.id = base64uuid()
        this.identifier = identifier
        this.password = password
        this.role = role
    }
}