import { ApiService, ApiServiceImpl } from "./api_service.js"
import { AuthService, AuthServiceImpl } from "./auth_service.js"

export interface ServiceProvider {
    auth: AuthService
    api: ApiService

    init(): Promise<void>
}

export class ServiceProviderImpl implements ServiceProvider {
    auth: AuthService
    api: ApiService

    constructor() {
        this.auth = new AuthServiceImpl()
        this.api = new ApiServiceImpl()
    }

    async init() {
        await this.auth.init()
        await this.api.init()
    }
}