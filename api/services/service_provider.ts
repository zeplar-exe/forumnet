var userRepository = new UserRepositoryImpl()

export = {
    "user_repository": UserRepositoryImpl,
    "auth": new AuthServiceImpl(userRepository),
}