import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { CA_FILE_DIRECTORY, EJBCA_ADMIN_PASS, EJBCA_ENDPOINT, PFX_FILE_DIRECTORY } from './config';


// Load the keystore used to authenticate to the REST API
const pfx = fs.readFileSync(PFX_FILE_DIRECTORY);
const ca = fs.readFileSync(CA_FILE_DIRECTORY);
const passphrase = EJBCA_ADMIN_PASS;
const agent = new https.Agent({
  ca: ca,  
  pfx: pfx,
  passphrase: passphrase,
  rejectUnauthorized: false
});

export const axiosInstance = axios.create({
  baseURL: EJBCA_ENDPOINT,
  httpsAgent: agent
});