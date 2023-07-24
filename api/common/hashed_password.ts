class HashedPassword {
    hashed: string

    private constructor(hashed: string) {
        this.hashed = hashed
    }

    static fromPlainText(plainText: string) {
        return new HashedPassword(plainText)
    }

    static fromHashed(hashed: string) {
        return new HashedPassword(hashed)
    }

    matches(other: HashedPassword) {
        return this.hashed === other.hashed
    }
}