import { HashedPassword } from "../common/hashed_password"
import { UserRepository } from "./user_repository"
import { Request } from "express"
import { UserRole } from "../models/user_role"
import { User } from "../models/user"
import { randomUUID } from "crypto"
import { ConflictError, BadRequestError } from "../common/http_error"
import { SessionToken, UserIdentifier } from "../models/value_objects"

export interface AuthService {
    signUp(identifier: UserIdentifier, password: string): string
    logIn(identifier: UserIdentifier, password: string): string
    logOut(sessionToken: SessionToken): void
    authenticate(req: Request): User | undefined
}

export class AuthServiceImpl implements AuthService {
    sessions: Map<string, User>
    userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.sessions = new Map<string, User>()
        this.userRepository = userRepository

        if (process.env.NODE_ENV === "dev") {
            var user = this.userRepository.createUser("dev_admin", HashedPassword.fromPlainText("dev_woop"), UserRole.Owner)
            this.sessions["dev"] = user

            console.log("Setup dev_admin user account.")
        }
    }

    signUp(identifier: UserIdentifier, password: string) {
        if (this.userRepository.getUserByIdentifier(identifier))
            throw new ConflictError("The given user identifier is already in use.")

        var hashedPassword = HashedPassword.fromPlainText(password)

        var user = this.userRepository.createUser(identifier, hashedPassword, UserRole.Regular)
        var sessionToken = this.createSessionToken()

        this.sessions[sessionToken] = user

        return sessionToken
    }

    logIn(identifier: UserIdentifier, password: string) {
        var user = this.userRepository.getUserByIdentifier(identifier)

        if (!user)
            throw new BadRequestError("The given user identifier is invalid.")

        var hashedPassword = HashedPassword.fromPlainText(password)

        if (!user.password.matches(hashedPassword))
            throw new BadRequestError("The given password is incorrect.")

        var sessionToken = this.getSessionByUser(user)

        if (!sessionToken) {
            sessionToken = this.createSessionToken()

            this.sessions[sessionToken] = user
        }
        
        return sessionToken
    }

    logOut(sessionToken: SessionToken) {
        var deleteSuccess = this.sessions.delete(sessionToken.toString())

        if (!deleteSuccess)
            throw new BadRequestError("The given session token is invalid.")
    }

    authenticate(req: Request): User | undefined {
        var authHeader = req.headers.authorization

        if (!authHeader)
            return undefined

        var parts = authHeader.split(' ')

        if (!parts || parts.length != 2)
            return undefined

        return this.getUserBySession(parts[1])
    }

    getUserBySession(sessionToken: SessionToken): User | undefined {
        return this.sessions[sessionToken.toString()]
    }

    getSessionByUser(user: User): string | undefined {
        return Object.keys(this.sessions).find(k => this.sessions[k] == user)
    }
    
    private createSessionToken() {
        return randomUUID() + "-" + randomUUID() + "-" + randomUUID()
        //  ¯\_(ツ)_/¯
    }
}