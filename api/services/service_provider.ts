import { AuthService, AuthServiceImpl } from "./auth_service"
import { ForumRepository, ForumRepositoryImpl } from "./forum_repository"
import { ForumUserRepository, ForumUserRepositoryImpl } from "./forum_user_repository"
import { UserRepository, UserRepositoryImpl } from "./user_repository"

export interface ServiceProvider {
    user_repository: UserRepository
    auth: AuthService
    forum_repository: ForumRepository
    forum_user_repository: ForumUserRepository
}

export class ServiceProviderImpl implements ServiceProvider {
    user_repository: UserRepository
    auth: AuthService
    forum_repository: ForumRepository
    forum_user_repository: ForumUserRepository

    constructor() {
        this.user_repository = new UserRepositoryImpl()
        this.auth = new AuthServiceImpl(this.user_repository)
        this.forum_repository = new ForumRepositoryImpl()
        this.forum_user_repository = new ForumUserRepositoryImpl()
    }
}