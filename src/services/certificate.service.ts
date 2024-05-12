import { axiosInstance } from "../config/axios";
import { defaultUser, User } from "../models/certificate.model";

export const getKeysByServer = async (
  username: string, 
  passphrase: string,
  email: string,
  fullname: string
): Promise<Buffer> => {
  try {
    console.log(`[LOG] Edit ${email}'s Status to NEW`);  
    const user: User = {
      ...defaultUser,
      username, passphrase, email, cn: fullname
    }
    await editUser(user);

    console.log(`[LOG] Certificate + Key Generation for ${email}'s`);  
    const certificateResponse = await axiosInstance.post('/ejbca/ejbca-rest-api/v1/certificate/enrollkeystore', {
      username: username,
      password: passphrase,
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

// Edit existing user, create new if not exist
const editUser = async(user: User) => {
  try {
    const soapRequest =
    `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.protocol.core.ejbca.org/">
        <soap:Header/>
        <soap:Body>
          <ws:editUser>
            <arg0>
              <username>${user.username}</username>
              <password>${user.passphrase}</password>
              <clearPwd>false</clearPwd>
              <subjectDN>CN=${user.cn},E=${user.email}</subjectDN>
              <caName>${user.ca_name}</caName>
              <email>${user.email}</email>
              <status>${user.status}</status>
              <tokenType>${user.token_type}</tokenType>
              <sendNotification>false</sendNotification>
              <keyRecoverable>false</keyRecoverable>
              <endEntityProfileName>${user.end_entity_profile}</endEntityProfileName>
              <certificateProfileName>${user.cert_entity_profile}</certificateProfileName>
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



