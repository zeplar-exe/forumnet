import { BackendConfig, BackendConfigImpl } from "./backend_config.js"
import { AuthService, AuthServiceImpl } from "./auth_service.js"

export interface ServiceProvider {
    auth: AuthService
    backend_config: BackendConfig

    init(): Promise<void>
}

export class ServiceProviderImpl implements ServiceProvider {
    auth: AuthService
    backend_config: BackendConfig

    constructor() {
        this.auth = new AuthServiceImpl()
        this.backend_config = new BackendConfigImpl()
    }

    async init() {
        await this.auth.init()
        await this.backend_config.init()
    }
}