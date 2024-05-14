import { Router } from "express";
import {  
  getCertificatesController,
  genKeysByServerController,
  revokeCertificateController,
  uploadController
} from "../controllers/certificate.controller";

const router = Router();

router.post("/certificate", genKeysByServerController);
router.post("/certificate/search", getCertificatesController);
router.put("/certificate/revoke", revokeCertificateController);


router.post("/test", uploadController)

export { router as certificate };