import { Middleware } from '../../http/types';

export const validateObjectId: Middleware = async (req, res, next) => {
	const id = req.params.id;

	// simple id validation example
	if (id.includes('$')) {
		res.statusCode = 400;
		res.write('Bad Request');
		return;
	}

	await next();
};
