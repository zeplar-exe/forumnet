export abstract class ServiceLayerError extends Error {
    abstract status: number
}

export class UnauthorizedError extends ServiceLayerError {
    status: number = 401
}

export class BadRequestError extends ServiceLayerError {
    status: number = 400
}

export class InternalError extends ServiceLayerError {
    status: number = 500
}

export class ConflictError extends ServiceLayerError {
    status: number = 409
}