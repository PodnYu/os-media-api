import { HttpRequest } from '../types';

// very simple read into memory
export async function readBody(req: HttpRequest): Promise<Buffer> {
	return new Promise((res, rej) => {
		const bufs: Buffer[] = [];
		req.on('data', (ch) => bufs.push(ch));
		req.on('end', () => res(Buffer.concat(bufs)));
		req.on('error', rej);
	});
}
