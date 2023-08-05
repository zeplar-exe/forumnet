import { randomUUID } from "crypto"
import { HashedPassword } from "../../common/hashed_password"
import { UserRole } from "./user_role"
import { UserID, UserIdentifier } from "../value_objects"
import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core"

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
    
    constructor(identifier: UserIdentifier, password: HashedPassword, role: UserRole) {
        this.id = randomUUID()
        this.identifier = identifier
        this.password = password
        this.role = role
    }
}