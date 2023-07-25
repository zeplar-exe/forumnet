declare global {
    interface Error {
        status?: number;
    }
}

export function statusCodeError(statusCode: number, message: string = "") {
    var error = new Error(message)
    error.status = statusCode
}

export function assertEnvironmentVariable(variable: string) {
    if (!process.env[variable]) {
        console.log("PASSWORD_SALT environment variable is missing.")
        throw new Error()
    }
}