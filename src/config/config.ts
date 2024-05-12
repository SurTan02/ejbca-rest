import "dotenv/config";

export const HOSTNAME= process.env.APP_ENDPOINT || 'localhost';
export const PORT= process.env.APP_PORT || '3000';

export const BUCKET_NAME= process.env.BUCKET_NAME || 'mybucket';

export const EJBCA_ENDPOINT= process.env.EJBCA_ENDPOINT || 'localhost:8080';
export const EJBCA_ADMIN_PASS= process.env.EJBCA_ADMIN_PASS || 'adminpass';


export const DEFAULT_CA_NAME=process.env.DEFAULT_CA_NAME || 'CloudCA';
export const DEFAULT_END_ENTITY_PROFILE=process.env.DEFAULT_END_ENTITY_PROFILE || 'Mahasiswa';
export const DEFAULT_CERTIFICATE_PROFILE=process.env.DEFAULT_CERTIFICATE_PROFILE || 'ENDUSER';

export const CA_FILE_DIRECTORY= process.env.CA_FILE_DIRECTORY || 'src/secret/ca.pem';
export const PFX_FILE_DIRECTORY= process.env.PFX_FILE_DIRECTORY || 'src/secret/pfx.p12';