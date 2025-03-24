import { Middleware } from '../../http/types';

const VALID_CONTENT_TYPES = [
	'image/png',
	'image/jpg',
	'text/plain',
	'application/octet-stream',
];

export const validateContentType: Middleware = async (req, res, next) => {
	const contentType = req.headers['content-type'] ?? '';

	if (!VALID_CONTENT_TYPES.includes(contentType)) {
		res.statusCode = 400;
		res.write('Bad Request');
		return;
	}

	await next();
};
