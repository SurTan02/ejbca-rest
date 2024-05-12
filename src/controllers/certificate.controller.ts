import { type Request, type Response } from "express";
import { getCertificates, getKeysByServer } from "../services/certificate.service";
import { uploadToStorage } from "../services/storage.service";

export const getKeysByServerController= async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    const p12File: Buffer = await getKeysByServer(username, password, email, email);

    // Save binary data to a .p12 file
    uploadToStorage(email + ".p12", p12File);

    res.status(200).send({'message': 'Certificate saved as certificate.p12'});
  }catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(500).send({ message: message });
  }
};

export const getCertificatesController = async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const body = await getCertificates(username);

    res.status(200).send(body);
  }catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    // console.error('Error create certificate', error);
    res.status(500).send({ message: message });
  }
};



