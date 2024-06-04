import { Pool } from "pg";
import { EJBCA_DATABASE_PG_URL } from "../config/env.config";

export const pool = new Pool({
  connectionString: EJBCA_DATABASE_PG_URL
});