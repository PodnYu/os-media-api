import Stream, { Readable } from 'stream';
import {
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export class ObjectsService {
	constructor(private s3Client: S3Client, private bucketName: string) {}

	async create(
		id: string,
		st: Readable,
		contentType: string,
		metadata: Record<string, string> = {}
	) {
		const upload = new Upload({
			client: this.s3Client,
			params: {
				Bucket: this.bucketName,
				Key: id,
				Body: st,
				Metadata: metadata,
				ContentType: contentType,
			},
		});

		await upload.done();
	}

	async getById(id: string) {
		const r = await this.s3Client.send(
			new GetObjectCommand({ Bucket: this.bucketName, Key: id })
		);

		if (!r?.Body) throw new Error('should not happen');

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		return Stream.Readable.fromWeb(r.Body.transformToWebStream());
	}

	async deleteById(id: string) {
		await this.s3Client.send(
			new DeleteObjectCommand({ Bucket: this.bucketName, Key: id })
		);
	}
}
