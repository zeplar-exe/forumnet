import { randomUUID } from "crypto"
import { HashedPassword } from "../common/hashed_password"
import { UserRole } from "./user_role"
import { UserID, UserIdentifier } from "./value_objects"

export class User {
    id: UserID
    identifier: UserIdentifier
    password: HashedPassword
    role: UserRole
    
    constructor(identifier: UserIdentifier, password: HashedPassword, role: UserRole) {
        this.id = randomUUID()
        this.identifier = identifier
        this.password = password
        this.role = role
    }
}