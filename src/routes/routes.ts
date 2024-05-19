import { Router } from "express";
import { certificate } from "./certificate.route";
const router = Router();

router.get("/",  (req, res) => {
  return res.send("<p>API for EJBCA</p>");
});
router.use(certificate);

export { router };