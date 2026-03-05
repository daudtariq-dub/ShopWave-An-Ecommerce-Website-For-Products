import 'dotenv/config';

const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
};

export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  // Google OAuth
  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: required('GOOGLE_CLIENT_SECRET'),
  // Elasticsearch
  ELASTIC_NODE: required('ELASTIC_NODE'),
  ELASTIC_API_KEY: required('ELASTIC_API_KEY'),
  ELASTIC_INDEX: process.env.ELASTIC_INDEX ?? 'products',
  // AWS S3
  AWS_ACCESS_KEY_ID: required('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: required('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: process.env.AWS_REGION ?? 'eu-north-1',
  AWS_S3_BUCKET: required('AWS_S3_BUCKET'),
  // Algolia
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID ?? '',
  ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY ?? '',
  ALGOLIA_INDEX: process.env.ALGOLIA_INDEX ?? 'products',
};
