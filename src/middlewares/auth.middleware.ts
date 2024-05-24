import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { authuser } from "../models/authuser.model";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('oauth-bearer', {
        session: false,
    }, (err: { message: any; }, user: any, info: Express.AuthInfo | undefined) => {
        if (err) {
            return res.status(401).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (info) {
            // access token payload will be available in req.authInfo downstream
            req.authuser = info as authuser;
            return next();
        }
    })(req, res, next);
};
