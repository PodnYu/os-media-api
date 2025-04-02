import fs from 'fs';
import { ObjectsService } from './api/objects/objects.service';
import { s3Client } from './services';
import { config } from './config';

export async function multiPartUpload() {
	const srv = new ObjectsService(s3Client, config.aws.s3BucketName);

	const key = '123';

	const { uploadId } = await srv.startMultiPartUpload(key);

	console.log({ uploadId });

	const { eTag } = await srv.uploadPart(key, {
		uploadId,
		partNumber: 1,
		body: fs.readFileSync('./test/test-objects/test1.txt'),
	});

	console.log({ eTag });

	await srv.completeMultiPartUpload(key, {
		uploadId,
		parts: [{ eTag: eTag, partNumber: 1 }],
	});
}
