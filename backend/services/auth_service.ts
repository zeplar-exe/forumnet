import { HashedPassword } from "../common/hashed_password"
import { Request } from "express"
import { UserRole } from "../models/entities/user_role"
import { User } from "../models/entities/user"
import { randomUUID } from "crypto"
import { ConflictError, BadRequestError } from "../common/http_error"
import { SessionToken, UserIdentifier } from "../models/value_objects"
import { orm } from "db"

export interface AuthService {
    init(): Promise<void>
    signUp(identifier: UserIdentifier, password: string): Promise<string>
    logIn(identifier: UserIdentifier, password: string): Promise<string>
    logOut(sessionToken: SessionToken): Promise<void>
    authenticate(req: Request): Promise<User | undefined>
}

export class AuthServiceImpl implements AuthService {
    sessions: Map<string, User>

    async init() {
        this.sessions = new Map<string, User>()

        if (process.env.NODE_ENV === "dev") {
            var user = new User("dev_admin", HashedPassword.fromPlainText("dev_woop"), UserRole.Owner)
            this.sessions["dev"] = user

            await orm.em.persistAndFlush(user)

            console.log("Setup dev_admin user account.")
        }
    }

    async signUp(identifier: UserIdentifier, password: string) {
        var existing = await orm.em.findOne(User, { identifier: identifier })

        if (existing)
            throw new ConflictError("The given user identifier is already in use.")

        var hashedPassword = HashedPassword.fromPlainText(password)

        var user = new User(identifier, hashedPassword, UserRole.Regular)
        var sessionToken = this.createSessionToken()

        this.sessions[sessionToken] = user

        await orm.em.persistAndFlush(user)

        return sessionToken
    }

    async logIn(identifier: UserIdentifier, password: string) {
        var user = await orm.em.findOne(User, { identifier: identifier })

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

    async logOut(sessionToken: SessionToken) {
        var deleteSuccess = this.sessions.delete(sessionToken.toString())

        if (!deleteSuccess)
            throw new BadRequestError("The given session token is invalid.")
    }

    async authenticate(req: Request) {
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