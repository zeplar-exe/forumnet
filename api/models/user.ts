import { HashedPassword } from "../common/hashed_password"
import { UserRole } from "./user_role"

export class User {
    id: string
    identifier: string
    password: HashedPassword
    role: UserRole
    
    constructor(id: string, identifier: string, password: HashedPassword, role: UserRole) {
        this.id = id
        this.identifier = identifier
        this.password = password
        this.role = role
    }
}