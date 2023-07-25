import { Request, Response } from 'express';
import { ServiceProvider } from 'services/service_provider';

export = function(serviceProvider: ServiceProvider) {
    return {
        "signUp": function(req: Request, res: Response) {
            var sessionToken = serviceProvider.auth.signUp(req.body["identifier"], req.body["password"])

            res.status(200).cookie("session_token", sessionToken).end()
        },
        "logIn": function(req: Request, res: Response) {
            var sessionToken = serviceProvider.auth.logIn(req.body["identifier"], req.body["password"])

            res.status(200).cookie("session_token", sessionToken, { sameSite: true, httpOnly: true, secure: true }).end()
        },
    }
}