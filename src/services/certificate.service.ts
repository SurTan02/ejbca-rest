import { axiosInstance } from "../config/axios.config";
import { DEFAULT_CA_DN, DEFAULT_CERTIFICATE_PROFILE, DEFAULT_END_ENTITY_PROFILE } from "../config/env.config";
import { pool } from "../databases/connection";
import { getRevocationReasonNumber, getRevocationReasonString, RevocationReason } from "../models/certificate.model";
import { User } from "../models/user.model";
import { editUser } from "./user.service";

export const genKeysByServer = async (user: User): Promise<Buffer> => {
  try {
    console.log(`[LOG] Edit ${user.username}'s Status to NEW`);  
    await editUser(user);

    // Check if user have active certificate
    const certificates = await fetchCertificates(user.username, RevocationReason.NOT_REVOKED, true);
    if (certificates?.length > 0){
      certificates.forEach((cert: { serial_number: string; }) => {
        revokeCertificate(cert.serial_number);
      });
    }
    console.log("<>>")

    console.log(`[LOG] Certificate + Key Generation for ${user.username}'s`);  
    const certificateResponse = await axiosInstance.post('/ejbca/ejbca-rest-api/v1/certificate/enrollkeystore', {
      username: user.username,
      password: user.passphrase,
      key_alg: 'RSA',
      key_spec: '2048',
    });

    const base64Data = certificateResponse.data.certificate;
    const binaryData = Buffer.from(base64Data, 'base64');

    return binaryData;

  }catch (error) {
    console.error(`[ERR] getKeysByServer: ${error}`);
    throw error;
  }
};

export const reqCertByCSR = async (user: User, csr: string): Promise<string> => {
  try {
    console.log(`[LOG] Certificate with CSR ${user.username}'s`);  
    const certificateResponse = await axiosInstance.post('/ejbca/ejbca-rest-api/v1/certificate/pkcs10enroll', {
      certificate_request: csr,
      username: user.username,
      password: user.passphrase,
      certificate_profile_name: DEFAULT_CERTIFICATE_PROFILE,
      end_entity_profile_name: DEFAULT_END_ENTITY_PROFILE,
      certificate_authority_name: "CloudCA",
      email: user.email
    });

    const base64Data = certificateResponse.data.certificate;
    const certData = "-----BEGIN CERTIFICATE-----\n"+ base64Data + "\n-----END CERTIFICATE-----" 
    return certData;

  }catch (error) {
    console.error(`[ERR] reqCertByCSR: ${error}`);
    throw error;
  }
};

export const fetchCertificates = async (
  username: string, 
  revocation_reason: RevocationReason | undefined = undefined,
  is_server_side: boolean = false //only get cert stored in server
) => {
  try {
    console.log(`[LOG] Search ${username}'s certificate with status ${revocation_reason}`);  
    let query = `
      SELECT subjectdn, serialnumber, revocationreason, certificaterequest
      FROM certificatedata WHERE username = $1`;
    const values = [username];
  
    // Check if revocation_reason is provided
    if (revocation_reason !== undefined) {
        query += ` AND revocationreason = $${values.length + 1}`;
        values.push(getRevocationReasonNumber(revocation_reason));
      }
    if (is_server_side) {
      query += ` AND certificaterequest is NULL`;
    }
    const { rows } = await pool.query(query, values);
    const data: any = [];
    rows.forEach((row: any) => {


      data.push({
        "subject_dn": row.subjectdn,
        "serial_number": BigInt(row.serialnumber).toString(16),
        "revocation_reason": getRevocationReasonString(row.revocationreason),
        "is_server_side": row.certificaterequest? false : true,
      })
    });
    return data;
  }catch (error) {
    console.error(`[ERR] fetchCertificates: ${error}`);
    throw error;
  }
};

export const getCertificate = async (serial_number: string) => {
  try {
    console.log(`[LOG] Search certificate with ${serial_number}`);  
    const certificateResponse = await axiosInstance.post('/ejbca/ejbca-rest-api/v1/certificate/search', {
      "max_number_of_results": 1,
      "criteria": [
        {
          "property": "QUERY",
          "value": serial_number,
          "operation": "EQUAL"
        }
      ]
    });

    const decode = Buffer.from(certificateResponse.data.certificates[0].certificate, 'base64')
    const certData = "-----BEGIN CERTIFICATE-----\n"+ decode.toString() + "\n-----END CERTIFICATE-----"
    return certData;
  }catch (error) {
    console.error(`[ERR] getCertificate: ${error}`);
    throw error;
  }
};


export const revokeCertificate = async (
  cert_serial_number: string,
  issuer_dn: string = DEFAULT_CA_DN,
  revocation_reason: RevocationReason= RevocationReason.SUPERSEDED
) => {
  try {
    console.log(`[LOG] Revoke certificate ${cert_serial_number}; reason ${revocation_reason}`);  
    const certificateResponse = await axiosInstance.put(
      `/ejbca/ejbca-rest-api/v1/certificate/${issuer_dn}/${cert_serial_number}/revoke?reason=${revocation_reason}`);
    console.log(`[LOG] Successfully revoke certificate ${cert_serial_number}`);  
    return certificateResponse.data;
  }catch (error: any) {
    console.warn(`[ERR] revokeCertificate: ${error?.response?.data}`);
    throw error;
  }
};

