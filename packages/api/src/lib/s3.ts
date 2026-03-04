import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: 'us-east-1', // Spaces uses this region regardless of actual location
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export const generatePresignedUploadUrl = async (
  key: string,
  expiresIn: number = 300
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

export const getCDNUrl = (key: string): string => {
  return `${process.env.DO_SPACES_CDN_ENDPOINT}/${key}`;
};
