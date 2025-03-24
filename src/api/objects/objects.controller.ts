import { pipeline } from 'stream';
import { HttpRequest, HttpResponse } from '../../http/types';
import { ObjectsService } from './objects.service';

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
}
