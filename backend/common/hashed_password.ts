import { pbkdf2Sync } from "crypto";
import { InternalError } from "./http_error";

export class HashedPassword {
    private static hashIterations = 10000

    hashed: string

    private constructor(hashed: string) {
        this.hashed = hashed
    }

    static fromPlainText(plainText: string) {
        if (!process.env.PASSWORD_SALT)
            throw new InternalError()

        var salt = btoa(process.env.PASSWORD_SALT!)
        var hash = pbkdf2Sync(plainText, salt, this.hashIterations, 64, "sha512")

        return new HashedPassword(hash.toString("base64"))
    }

    static fromHashed(hashed: string) {
        return new HashedPassword(hashed)
    }

    matches(other: HashedPassword) : boolean {
        console.log(this.hashed)
        console.log(other.hashed)
        console.log(this.hashed === other.hashed)
        return this.hashed === other.hashed
    }

    toJSON() {
        return this.hashed
    }

    static fromJSON(jsonString: string): HashedPassword {
        return HashedPassword.fromHashed(jsonString);
    }
}