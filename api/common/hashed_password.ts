import { pbkdf2Sync } from "crypto";
import { assertEnvironmentVariable } from "./error";

export class HashedPassword {
    private static hashIterations = 10000

    hashed: string

    private constructor(hashed: string) {
        this.hashed = hashed
    }

    static fromPlainText(plainText: string) {
        assertEnvironmentVariable("PASSWORD_SALT")

        var salt = btoa(process.env.PASSWORD_SALT!)
        var hash = pbkdf2Sync(plainText, salt, this.hashIterations, 64, "sha512")

        return new HashedPassword(hash.toString("base64"))
    }

    static fromHashed(hashed: string) {
        return new HashedPassword(hashed)
    }

    matches(other: HashedPassword) : boolean {
        return this.hashed === other.hashed
    }
}