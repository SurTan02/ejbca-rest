import { axiosInstance } from "../config/axios.config";
import { DEFAULT_CA_DN, DEFAULT_CERTIFICATE_PROFILE, DEFAULT_END_ENTITY_PROFILE } from "../config/env.config";
import { RevocationReason } from "../models/certificate.model";
import { User } from "../models/user.model";

export const genKeysByServer = async (user: User): Promise<Buffer> => {
  try {
    console.log(`[LOG] Edit ${user.username}'s Status to NEW`);  
    await editUser(user);

    // Check if user have active certificate
    const certificates = await getCertificates(user.username);
    if (certificates?.certificates.length > 0){
      certificates.certificates.forEach((cert: { serial_number: string; }) => {
        revokeCertificate(cert.serial_number);
      });
    }

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

export const getCertificates = async (
  username: string, 
  status: string | undefined = "CERT_ACTIVE"
) => {
  try {
    console.log(`[LOG] Search ${username}'s certificate`);  
    const certificateResponse = await axiosInstance.post('/ejbca/ejbca-rest-api/v1/certificate/search', {
      "max_number_of_results": 10,
      "criteria": [
        {
          "property": "QUERY",
          "value": username,
          "operation": "EQUAL"
        },
        {
          "property": "STATUS",
          "value": status,
          "operation": "EQUAL"
        }
      ]
    });

    const data: any = [];
    certificateResponse.data.certificates.forEach((cert: any) => {
      data.push({
        "certificate": cert.certificate,
        "serial_number": cert.serial_number})
    });

    return certificateResponse.data;
  }catch (error) {
    console.error(`[ERR] getCertificates: ${error}`);
    throw error;
  }
};

export const revokeCertificate = async (
  cert_serial_number: string,
  issuer_dn: string = DEFAULT_CA_DN,
  revocation_reason: RevocationReason= RevocationReason.SUPERSEDED
) => {
  try {
    console.log(`[LOG] Revoke certificate ${cert_serial_number}`);  
    const certificateResponse = await axiosInstance.put(
      `/ejbca/ejbca-rest-api/v1/certificate/${issuer_dn}/${cert_serial_number}/revoke?reason=${revocation_reason}`);
    return certificateResponse.data;
  }catch (error: any) {
    console.warn(`[ERR] revokeCertificate: ${error?.response?.data}`);
    throw error;
  }
};

// Edit existing user, create new if not exist
const editUser = async(editedUser: User) => {
  try {
    const soapRequest =
    `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.protocol.core.ejbca.org/">
        <soap:Header/>
        <soap:Body>
          <ws:editUser>
            <arg0>
              <username>${editedUser.username}</username>
              <password>${editedUser.passphrase}</password>
              <clearPwd>false</clearPwd>
              <subjectDN>CN=${editedUser.cn},E=${editedUser.email}</subjectDN>
              <caName>${editedUser.ca_name}</caName>
              <email>${editedUser.email}</email>
              =
              <status>${editedUser.status}</status>
              <tokenType>${editedUser.token_type}</tokenType>
              <sendNotification>false</sendNotification>
              <keyRecoverable>false</keyRecoverable>
              <endEntityProfileName>${editedUser.end_entity_profile}</endEntityProfileName>
              <certificateProfileName>${editedUser.cert_entity_profile}</certificateProfileName>
            </arg0>
          </ws:editUser>
        </soap:Body>
      </soap:Envelope>
    `
    await axiosInstance.post('/ejbca/ejbcaws/ejbcaws',
      soapRequest,
      {headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://ws.protocol.core.ejbca.org/editUser'
      }}
    );
  } catch (error) {
    console.error(`[ERR] editUser: ${error}`);
    throw new Error("Failed to update user status");
  }
  
}
