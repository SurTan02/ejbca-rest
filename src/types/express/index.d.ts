import { authuser } from "../../models/authuser.models";

declare global {
    namespace Express {
        interface Request {
            authuser: authuser;
        }
    }
}