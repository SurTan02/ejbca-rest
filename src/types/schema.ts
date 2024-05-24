import { RevocationReason } from "../models/certificate.model";

export class CertificateRequest {
  username: string = "your username / email";
}

export class CertificateRevokeRequest {
  serial_number: string = "cert_serial_number";
  issued_dn?: string = "CloudCA";
  revocation_reason: RevocationReason = RevocationReason.KEY_COMPROMISE;
}

export class CertificateEnrollRequest {
  passphrase: string = "secure_passphrase";
}

export class CertificateCSRRequest {
  csr: string ="-----BEGIN CERTIFICATE REQUEST-----\n<CERT>\n-----END CERTIFICATE REQUEST-----";
  passphrase: string = "secure_passphrase";
}