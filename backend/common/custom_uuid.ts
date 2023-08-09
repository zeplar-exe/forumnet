import { randomUUID } from "crypto";

export function base64uuid() {
    var uuid = randomUUID()

    return Buffer.from(uuid, "binary").toString("base64url")
}