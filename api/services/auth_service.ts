import { HashedPassword } from "common/hashed_password"
import { UserRepository } from "./user_repository"
import { statusCodeError } from "common/error"

export interface AuthService {
    signUp(identifier: string, password: string): string
    logIn(identifier: string, password: string): string
    logOut(sessionToken: string): void
}

export class AuthServiceImpl implements AuthService {
    sessions: Map<string, User>
    userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.sessions = new Map<string, User>()
        this.userRepository = userRepository
    }

    signUp(identifier: string, password: string) {
        if (this.userRepository.getUserByIddentifier(identifier))
            throw statusCodeError(409, "The given user identifier is already in use.")

        var hashedPassword = HashedPassword.fromPlainText(password)

        var user = this.userRepository.createUser(identifier, hashedPassword, UserRole.Regular)
        var sessionToken = this.createSessionToken()

        this.sessions[sessionToken] = user

        return sessionToken
    }

    logIn(identifier: string, password: string) {
        var user = this.userRepository.getUserByIddentifier(identifier)

        if (!user)
            throw statusCodeError(400, "The given user identifier is invalid.")

        var hashedPassword = HashedPassword.fromPlainText(password)

        if (user.password.matches(hashedPassword))
            throw statusCodeError(400, "The given password is incorrect.")

        var sessionToken = this.getSessionByUser(user)

        if (!sessionToken) {
            sessionToken = this.createSessionToken()
        }
        
        return sessionToken
    }

    logOut(sessionToken: string) {
        var deleteSuccess = this.sessions.delete(sessionToken)

        if (!deleteSuccess)
            throw statusCodeError(400, "The given session token is invalid.")
    }

    getUserBySession(sessionToken: string): User | undefined {
        return this.sessions[sessionToken]
    }

    getSessionByUser(user: User): string | undefined {
        return Object.keys(this.sessions).find(k => this.sessions[k] == user)
    }

    private createSessionToken() {
        return crypto.randomUUID()
    }
}