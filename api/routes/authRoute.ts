module.exports = function(serviceProvider) {
    return {
        "signUp": function(req, res) {

        },
        "logIn": function(req: Request, res: Response) {
            serviceProvider.auth.logIn(req.body!["identifier"], req.body!["password"])
        },
    }
}