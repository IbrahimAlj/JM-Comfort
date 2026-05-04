const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const cleanEnv = (v) => (v || "").trim().replace(/^['"]+|['"]+$/g, "");

const s3Client = new S3Client({
  region: cleanEnv(process.env.AWS_REGION) || "us-west-1",
  credentials: {
    accessKeyId: cleanEnv(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: cleanEnv(process.env.AWS_SECRET_ACCESS_KEY),
  },
});

const BUCKET_NAME = cleanEnv(process.env.S3_BUCKET_NAME);

module.exports = { s3Client, PutObjectCommand, DeleteObjectCommand, BUCKET_NAME };
