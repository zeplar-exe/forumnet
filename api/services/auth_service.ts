interface AuthService {
    signUp(identifier: string, password: string): 
        { success: boolean, session_token: string | undefined, message: string | undefined }
    logIn(identifier: string, password: string): 
        { success: boolean, session_token: string | undefined, message: string | undefined }
    logOut(sessionToken: string): { success: boolean, message: string | undefined }
}

class AuthServiceImpl implements AuthService {
    sessions: Map<string, User>
    userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.sessions = new Map<string, User>()
        this.userRepository = userRepository
    }

    signUp(identifier: string, password: string) {
        if (this.userRepository.getUserByIddentifier(identifier))
            return { success: false, session_token: undefined, message: "The given user identifier is already taken." }

        var hashedPassword = HashedPassword.fromPlainText(password)

        var user = this.userRepository.createUser(identifier, hashedPassword, UserRole.Regular)

        var sessionToken = crypto.randomUUID()
        this.sessions[sessionToken] = user

        return { success: true, session_token: sessionToken, message: "Successfully created account." }
    }

    logIn(identifier: string, password: string) {
        var user = this.userRepository.getUserByIddentifier(identifier)

        if (!user)
            return { success: false, session_token: undefined, message: "The given user identifier is invalid." }

        var hashedPassword = HashedPassword.fromPlainText(password)

        if (user.password !== hashedPassword)
            return { success: false, session_token: undefined, message: "The given password is incorrect." }

        return { success: true, session_token: "", message: "Successfully logged in." }
    }

    logOut(sessionToken: string) {
        var deleteSuccess = this.sessions.delete(sessionToken)

        return { success: deleteSuccess, message: deleteSuccess ? undefined : "The given session token is invalid." }
    }
}