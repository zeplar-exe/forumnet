import { ApiService, ApiServiceImpl } from "./api_service"
import { AuthService, AuthServiceImpl } from "./auth_service"

export interface ServiceProvider {
    auth: AuthService
    api: ApiService
}

export class ServiceProviderImpl implements ServiceProvider {
    auth: AuthService
    api: ApiService

    constructor() {
        this.auth = new AuthServiceImpl()
        this.api = new ApiServiceImpl()

        this.auth.init()
        this.api.init()
    }
}