class HashedPassword {
    hashed: string

    constructor(plainTextPassword: string) {
        this.hashed = plainTextPassword
    }

    matches(other: HashedPassword) {
        return this.hashed === other.hashed
    }
}