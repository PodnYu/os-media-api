import { Logger } from '../utils/logger';
import { Route } from './types';
import { HttpRequest, HttpResponse, Params } from './types';

export async function processRequest(
	route: Route,
	req: HttpRequest,
	res: HttpResponse,
	{ logger }: { logger: Logger }
) {
	// simple monkey patch
	req.params = getParams(route.path, req.url);

	const middlewares = route.middleware ?? [];

	let middlewareIndex = 0;

	// simple middleware processing
	async function next() {
		if (middlewareIndex >= middlewares.length) {
			return route.handler(req, res);
		}

		return middlewares[middlewareIndex++](req, res, next);
	}

	await next().catch((err) => {
		logger.error(err);

		res.statusCode = 500;
		res.write('Internal Server Error');
	});

	res.end();
}

function getParams(spec: string, url: string): Params {
	const paramKeys = spec
		.split('/')
		.map((part, i) => [part, i] as [string, number])
		.filter(([part]) => part.startsWith(':'));

	const urlParts = url.split('/');

	return paramKeys.reduce(
		(prev, [part, i]) => ({ ...prev, [part.slice(1)]: urlParts[i] }),
		{}
	);
}
