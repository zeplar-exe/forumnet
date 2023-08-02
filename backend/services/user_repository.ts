import { UserID, UserIdentifier } from "../models/value_objects"
import { HashedPassword } from "../common/hashed_password"
import { User } from "../models/user"
import { UserRole } from "../models/user_role"

export interface UserRepository {
    createUser(identifier: UserIdentifier, password: HashedPassword, role: UserRole): User | undefined
    getUserById(userId: UserID): User | undefined
    getUserByIdentifier(userIdentifier: UserIdentifier): User | undefined
}

export class UserRepositoryImpl implements UserRepository {
    users: Array<User>

    constructor() {
        this.users = new Array<User>()
    }

    createUser(identifier: UserIdentifier, password: HashedPassword, role: UserRole) {
        var user = new User(identifier, password, role)

        this.users.push(user)

        return user
    }

    getUserById(userId: UserID) {
        return this.users.find(user => user.id == userId)
    }

    getUserByIdentifier(userIdentifier: UserIdentifier) {
        return this.users.find(user => user.identifier == userIdentifier)
    }
}