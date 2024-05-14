import { Storage } from "@google-cloud/storage";
import { BUCKET_NAME, GOOGLE_APPLICATION_CREDENTIALS } from "../config/env.config";


// Creates a client
const storage = new Storage({
  credentials: require(GOOGLE_APPLICATION_CREDENTIALS)
});
const bucketName = BUCKET_NAME;


export const uploadToStorage = async(filename: string, content: Buffer) =>{

  await storage.bucket(bucketName!).file(filename).save(content);

  console.log(
    `${filename} with contents uploaded to ${bucketName}.`
  );
}
