export const config = {
	port: +getEnvValueOrFail('PORT', '8080'),
	aws: {
		s3BucketName: getEnvValueOrFail('S3_BUCKET_NAME'),
		region: getEnvValueOrFail('AWS_REGION'),
		keyId: getEnvValueOrFail('ACCESS_KEY_ID'),
		secretKey: getEnvValueOrFail('SECRET_ACCESS_KEY'),
	},
};

function getEnvValueOrFail(key: string, defaultValue?: string) {
	if (process.env[key]) return process.env[key];

	if (defaultValue) return defaultValue;

	throw new Error(`ENV: ${key} var not provided`);
}
