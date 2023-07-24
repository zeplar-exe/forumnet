import { Request, Response } from 'express';

export = function(serviceProvider) {
    return {
        "signUp": function(req: Request, res: Response) {
            if (!req.body) {
                res.status(404).end()
                return
            }

            var result = serviceProvider.auth.signUp(req.body["identifier"], req.body["password"])

            if (!result.success)
                res.status(404).json({ message: result.message }).end()

            res.status(200).cookie("session_token", result.session_token).json({ message: result.message }).end()
        },
        "logIn": function(req: Request, res: Response) {
            if (!req.body) {
                res.status(404).end()
                return
            }

            var result = serviceProvider.auth.logIn(req.body["identifier"], req.body["password"])

            if (!result.success)
                res.status(404).json({ message: result.message }).end()

            res.status(200).cookie("session_token", result.session_token).json({ message: result.message }).end()
        },
    }
}