import { Request, Response, Router } from 'express';
import { ServiceProvider } from 'services/service_provider';

export = function(router: Router, serviceProvider: ServiceProvider) {
    router.post("/auth/signup", (req: Request, res: Response) => {
        var sessionToken = serviceProvider.auth.signUp(req.body["identifier"], req.body["password"])

        res.status(200).cookie("session_token", sessionToken).end()
    })

    router.post("/auth/login", (req: Request, res: Response) => {
        var sessionToken = serviceProvider.auth.logIn(req.body["identifier"], req.body["password"])

        res.status(200).cookie("session_token", sessionToken, { sameSite: true, httpOnly: true, secure: true }).end()
    })
}