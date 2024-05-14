import { type Request, type Response } from "express";
import { getCertificates, genKeysByServer, revokeCertificate } from "../services/certificate.service";
import { uploadToStorage } from "../services/storage.service";
import { errorHandler } from "../config/axios.config";

export const genKeysByServerController= async (req: Request, res: Response) => {
  const { preferred_username, email, name, password } = req.body;
  // const { preferred_username, name } = req.authuser;
  // const email= preferred_username;
  try {
    const p12File: Buffer = await genKeysByServer(preferred_username, password, email, name);

    // Save binary data to a .p12 file
    uploadToStorage(`${email}/${email}.p12`, p12File);

    res.status(200).send({'message': 'Certificate saved as certificate.p12'});
  }catch (error: any) {
    const {message, error_code} = errorHandler(error);
    res.status(error_code).send({ message: message });
  }
};

export const getCertificatesController = async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const body = await getCertificates(username);
    res.status(200).send(body);
  }catch (error: any) {
    const {message, error_code} = errorHandler(error);
    res.status(error_code).send({ message: message });
  }
};

export const revokeCertificateController = async (req: Request, res: Response) => {
  const { serial_number, issuer_dn, revocation_reason } = req.body;
  try {
    const body = await revokeCertificate(serial_number, issuer_dn, revocation_reason);
    res.status(200).send(body);
  }catch (error: any) {
    const {message, error_code} = errorHandler(error);
    res.status(error_code).send({ message: message });
  }
};

export const uploadController = async (req: Request, res: Response) => {
  try {
    uploadToStorage('test.txt', Buffer.from('HELLO TEXT'));
    res.status(200).send("success");
  }catch (error: any) {
    const {message, error_code} = errorHandler(error);
    res.status(error_code).send({ message: message });
  }
};

