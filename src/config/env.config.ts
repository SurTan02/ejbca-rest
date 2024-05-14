import "dotenv/config";
import * as path from 'path';
import fs from 'fs';

function getAppRootDir () {
  let currentDir = __dirname
  while(!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..')
  }
  return currentDir
}

const basedir = getAppRootDir()
export const HOSTNAME= process.env.APP_ENDPOINT || 'localhost';
export const PORT= process.env.APP_PORT || '3000';

export const BUCKET_NAME= process.env.BUCKET_NAME || 'mybucket';

export const EJBCA_ENDPOINT= process.env.EJBCA_ENDPOINT || 'localhost:8080';
export const EJBCA_ADMIN_PASS= process.env.EJBCA_ADMIN_PASS || 'adminpass';


export const DEFAULT_CA_DN=process.env.DEFAULT_CA_DN || 'CN=CloudCA,O=CloudITB,C=ID';
export const DEFAULT_END_ENTITY_PROFILE=process.env.DEFAULT_END_ENTITY_PROFILE || 'Mahasiswa';
export const DEFAULT_CERTIFICATE_PROFILE=process.env.DEFAULT_CERTIFICATE_PROFILE || 'ENDUSER';

export const CA_FILE_DIRECTORY=(path.join(basedir, process.env.CA_FILE_DIRECTORY || 'src/secret/ca.pem'));
export const PFX_FILE_DIRECTORY= (path.join(basedir, process.env.PFX_FILE_DIRECTORY || 'src/secret/pfx.p12'));
export const GOOGLE_APPLICATION_CREDENTIALS= (path.join(basedir, process.env.GOOGLE_APPLICATION_CREDENTIALS || 'src/secret/key.json'));

export const MS_CLIENT_ID= process.env.MS_CLIENT_ID || 'string';
export const MS_TENANT_ID= process.env.MS_TENANT_ID || 'string';