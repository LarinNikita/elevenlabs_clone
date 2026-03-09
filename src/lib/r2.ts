import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

// const s3 = new S3Client({
//   region: "auto",
//   endpoint: `https://${env.s3_ACCOUNT_ID}.s3.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: env.S3_ACCESS_KEY_ID,
//     secretAccessKey: env.S3_SECRET_ACCESS_KEY,
//   },
// });
const s3 = new S3Client({
  region: "us-east-1",
  endpoint: `http://localhost:9000`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

type UploadAudioOptions = {
  buffer: Buffer;
  key: string;
  contentType?: string;
};

export async function uploadAudio({
  buffer,
  key,
  contentType,
}: UploadAudioOptions): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
}

export async function deleteAudio(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
}

export async function getSignedAudioUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3, command, {
    expiresIn: 3600, // 1 hour
  });
}
