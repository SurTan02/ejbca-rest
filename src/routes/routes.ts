import { Router } from "express";
import { certificate } from "./certificate.route";
const router = Router();

router.use(certificate);

export { router };