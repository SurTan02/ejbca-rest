import { authuser } from "../../models/authuser.model";

declare global {
    namespace Express {
        interface Request {
            authuser: authuser;
        }
    }
}