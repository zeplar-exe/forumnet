import { AuthService, AuthServiceImpl } from "./auth_service"
import { UserRepository, UserRepositoryImpl } from "./user_repository"

export interface ServiceProvider {
    user_repository: UserRepository
    auth: AuthService
}

export class ServiceProviderImpl implements ServiceProvider {
    user_repository: UserRepository
    auth: AuthService

    constructor() {
        this.user_repository = new UserRepositoryImpl()
        this.auth = new AuthServiceImpl(this.user_repository)
    }
}