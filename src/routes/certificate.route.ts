import { Router } from "express";
import {  
  getCertificatesController,
  genKeysByServerController,
  revokeCertificateController
} from "../controllers/certificate.controller";

const router = Router();

router.post("/certificate", genKeysByServerController);
router.post("/certificate/search", getCertificatesController);
router.put("/certificate/revoke", revokeCertificateController);

export { router as certificate };