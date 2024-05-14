import axios, { AxiosError } from 'axios';
import fs from 'fs';
import https from 'https';
import { CA_FILE_DIRECTORY, EJBCA_ADMIN_PASS, EJBCA_ENDPOINT, PFX_FILE_DIRECTORY } from './env.config';


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

export const errorHandler = (error: AxiosError | Error) => {
  let message;
  let error_code= 500;
  if (error instanceof AxiosError){
    message = error.response?.data.error_message;
    error_code= error.response?.data.error_code;
  } else if (error instanceof Error){
    message= error.message;
  } else {
    message = String(error);
  }
  return {message, error_code};
}