import { HashedPassword } from "../common/hashed_password"
import { User } from "../models/user"
import { UserRole } from "../models/user_role"

export interface UserRepository {
    createUser(identifier: string, password: HashedPassword, role: UserRole): User | undefined
    getUserById(userId: string): User | undefined
    getUserByIdentifier(userIdentifier: string): User | undefined
}

export class UserRepositoryImpl implements UserRepository {
    users: Array<User>

    constructor() {
        this.users = new Array<User>()
    }

    createUser(identifier: string, password: HashedPassword, role: UserRole) {
        var user = new User(identifier, password, role)

        this.users.push(user)

        return user
    }

    getUserById(userId: string) {
        return this.users.find(user => user.id == userId)
    }

    getUserByIdentifier(userIdentifier: string) {
        return this.users.find(user => user.identifier == userIdentifier)
    }
}