import { Request } from "express"

export function createLocationUrl(req: Request) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}