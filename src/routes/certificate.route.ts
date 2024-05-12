import { Router } from "express";
import { getCertificatesController, getKeysByServerController, } from "../controllers/certificate.controller";
const router = Router();

router.post("/certificate", getKeysByServerController);
router.post("/certificate/search", getCertificatesController);

export { router as certificate };