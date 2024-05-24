import { Router } from "express";
import {  
  getCertificatesController,
  genKeysByServerController,
  revokeCertificateController,
  reqCertByCSRController
} from "../controllers/certificate.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken);
router.get("/certificate", getCertificatesController);
router.post("/certificate", genKeysByServerController);
router.post("/certificate/csr", reqCertByCSRController);
router.put("/certificate/revoke", revokeCertificateController);

export { router as certificate };