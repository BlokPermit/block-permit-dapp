import S3 from "aws-sdk/clients/s3";
import axios from "axios";

const s3 = new S3({
  region: "eu-central-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export default async function saveToS3(file: File) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
      Expires: 600,
      ContentType: file.type,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return "Upload successful";
  } catch (error) {
    return error;
  }
}
