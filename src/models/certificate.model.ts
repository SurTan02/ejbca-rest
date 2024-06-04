// ref: https://doc.primekey.com/ejbca/ejbca-operations/ejbca-ca-concept-guide/end-entities-overview/certificate-statuses
export enum RevocationReason  {
  KEY_COMPROMISE= "KEY_COMPROMISE",
  NOT_REVOKED= "NOT_REVOKED",
  CA_COMPROMISE= "CA_COMPROMISE",
  UNSPECIFIED= "UNSPECIFIED",
  AFFILIATION_CHANGED= "AFFILIATION_CHANGED",
  SUPERSEDED= "SUPERSEDED",
  CESSATION_OF_OPERATION= "CESSATION_OF_OPERATION",
  CERTIFICATE_HOLD= "CERTIFICATE_HOLD",
  REMOVE_FROM_CRL= "REMOVE_FROM_CRL",
  PRIVILEGES_WITHDRAWN= "PRIVILEGES_WITHDRAWN",
  AA_COMPROMISE= "AA_COMPROMISE"
}

const reason = {
  NOT_REVOKED:"-1",
  UNSPECIFIED: "0",
  KEY_COMPROMISE: "1",
  CA_COMPROMISE: "2",
  AFFILIATION_CHANGED: "3",
  SUPERSEDED: "4",
  CESSATION_OF_OPERATION: "5",
  CERTIFICATE_HOLD: "6",
  REMOVE_FROM_CRL: "8",
  PRIVILEGES_WITHDRAWN: "9",
  AA_COMPROMISE: "10"
}

export const getRevocationReasonString = (revocation_reason: number) => {
  return (Object.keys(reason)[Object.values(reason).indexOf(revocation_reason.toString())]);
}

export const getRevocationReasonNumber = (revocation_reason: RevocationReason) => {
  return reason[revocation_reason];
}