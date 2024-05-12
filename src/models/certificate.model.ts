import { DEFAULT_CERTIFICATE_PROFILE, DEFAULT_END_ENTITY_PROFILE } from "../config/config"

export type User = {
  username: string;
  passphrase: string;
  cn: string;
  ca_name: string;
  email: string;
  status: UserStatus;
  token_type: string;
  end_entity_profile: string;
  cert_entity_profile: string;
}

// ref: https://doc.primekey.com/ejbca/ejbca-operations/ejbca-ca-concept-guide/end-entities-overview
enum UserStatus {
  STATUS_NEW= 10,
  STATUS_FAILED= 11,
  STATUS_GENERATED= 40,
  STATUS_REVOKED= 50
}

// ref: https://doc.primekey.com/ejbca/ejbca-operations/ejbca-ca-concept-guide/end-entities-overview/certificate-statuses

export const defaultUser: User = {
  username: 'string',
  passphrase: 'string',
  cn: 'string',
  email: 'string',

  ca_name: 'CloudCA',
  status: UserStatus.STATUS_NEW,
  token_type: 'P12',
  end_entity_profile: DEFAULT_END_ENTITY_PROFILE,
  cert_entity_profile: DEFAULT_CERTIFICATE_PROFILE
}