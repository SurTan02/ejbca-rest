import { DEFAULT_CERTIFICATE_PROFILE, DEFAULT_END_ENTITY_PROFILE } from "../config/env.config"

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

export enum RevocationReason {
  NOT_REVOKED= "NOT_REVOKED",
  UNSPECIFIED= "UNSPECIFIED",
  KEY_COMPROMISE= "KEY_COMPROMISE",
  CA_COMPROMISE= "CA_COMPROMISE",
  AFFILIATION_CHANGED= "AFFILIATION_CHANGED",
  SUPERSEDED= "SUPERSEDED",
  CESSATION_OF_OPERATION= "CESSATION_OF_OPERATION",
  CERTIFICATE_HOLD= "CERTIFICATE_HOLD",
  REMOVE_FROM_CRL= "REMOVE_FROM_CRL",
  PRIVILEGES_WITHDRAWN= "PRIVILEGES_WITHDRAWN",
  AA_COMPROMISE= "AA_COMPROMISE"
}