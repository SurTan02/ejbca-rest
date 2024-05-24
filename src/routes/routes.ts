import { Router } from "express";
import { certificate } from "./certificate.route";
const router = Router();

/**
 * List of API examples.
 * @route GET /api
 */
router.get("/",  (req, res) => {
  return res.send("<p>API for EJBCA</p>");
});
router.use(certificate);

export { router };