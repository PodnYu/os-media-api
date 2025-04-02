import { pipeline } from 'stream';
import { HttpRequest, HttpResponse } from '../../http/types';
import { ObjectsService } from './objects.service';
import { readBody } from '../../http/utils/read-body';
import queryString from 'querystring';

export class ObjectsController {
	constructor(private service: ObjectsService) {}

	async create(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;
		const contentType = req.headers['content-type'] ?? '';

		await this.service.create(id, req, contentType, {
			created_at: new Date().toISOString(),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			creator_address: (req.socket.address() as any).address ?? '',
		});

		res.statusCode = 201;
	}

	async getById(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		await this.service
			.getById(id)
			.then((readStream) => {
				res.statusCode = 200;

				return new Promise<void>((resolve, reject) =>
					pipeline(readStream, res, (err) => {
						if (!err) return resolve();
						reject(err);
					})
				);
			})
			.catch((err) => {
				if (err.name === 'NoSuchKey') {
					res.statusCode = 404;
					res.write('Not Found');
					return;
				}

				throw err;
			});
	}

	async updateById(req: HttpRequest, res: HttpResponse) {
		await this.create(req, res);
	}

	async deleteById(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		await this.service.deleteById(id);

		res.statusCode = 204;
	}

	async startMultiPartUpload(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		const { uploadId } = await this.service.startMultiPartUpload(id);

		res.write(JSON.stringify({ uploadId }));

		res.statusCode = 201;
	}

	async uploadPart(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		const qs = queryString.parse(req.url.slice(req.url.indexOf('?') + 1));

		const uploadId = qs['upload-id'] as string | undefined;
		const partNumberString = qs['part-number'] as string | undefined;
		const partNumber =
			partNumberString === undefined ? null : parseInt(partNumberString, 10);

		// cannot submit stream to s3 sdk
		const body = await readBody(req);

		if (uploadId === undefined || partNumber === null) {
			res.statusCode = 400;
			return;
		}

		const { eTag } = await this.service.uploadPart(id, {
			uploadId,
			partNumber: partNumber,
			body,
		});

		res.write(JSON.stringify({ eTag }));

		res.statusCode = 201;
	}

	async completeMultiPartUpload(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		const qs = queryString.parse(req.url.slice(req.url.indexOf('?') + 1));

		const uploadId = qs['upload-id'] as string | undefined;

		const body = await readBody(req);

		// need to be validated
		const parts = JSON.parse(body.toString());

		if (!uploadId) {
			res.statusCode = 400;
			return;
		}

		await this.service.completeMultiPartUpload(id, {
			uploadId,
			parts,
		});

		res.statusCode = 201;
	}

	async abortMultiPartUpload(req: HttpRequest, res: HttpResponse) {
		const id = req.params.id;

		const qs = queryString.parse(req.url.slice(req.url.indexOf('?') + 1));

		const uploadId = qs['upload-id'] as string | undefined;

		if (!uploadId) {
			res.statusCode = 400;
			return;
		}

		await this.service.abortMultiPartUpload(id, { uploadId });

		res.statusCode = 201;
	}
}
