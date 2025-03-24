import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config';
import { createLogger } from './utils/logger';

export const logger = createLogger();

export const s3Client = new S3Client({
	credentials: {
		accessKeyId: config.aws.keyId,
		secretAccessKey: config.aws.secretKey,
	},
	region: config.aws.region,
});
