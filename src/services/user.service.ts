import { axiosInstance } from "../config/axios.config";
import { User } from "../models/user.model";

// Edit existing user, create new if not exist
export const editUser = async(editedUser: User) => {
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
