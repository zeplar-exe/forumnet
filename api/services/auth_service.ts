class AuthService {
    sessions: Map<string, User>

    constructor() {
        this.sessions = new Map<string, User>()
    }

    signUp(identifier: string, password: string) {
        var hashedPassword = new HashedPassword(password)

        return { success: true }
    }

    logIn(identifier: string, password: string) {
        var hashedPassword = new HashedPassword(password)

        return { success: true }
    }

    logOut(sessionToken: string) {
        return { success: this.sessions.delete(sessionToken) }
    }
}

module.exports = new AuthService()