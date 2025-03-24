import http, { RequestListener } from 'http';
import { HttpRequest, Route, Router } from './types';
import { matchRoute } from './match-route';
import { processRequest } from './process-request';
import { Logger } from '../utils/logger';

export function createApp({
	routers,
	logger,
}: {
	routers: Router[];
	logger: Logger;
}) {
	const httpHandler = createHttpHandler({ routes: getRoutes(routers), logger });

	return http.createServer(httpHandler);
}

function createHttpHandler({
	routes,
	logger,
}: {
	routes: Route[];
	logger: Logger;
}): RequestListener {
	return async (req, res) => {
		logger.info({ url: req.url, method: req.method });

		if (req.url === undefined || req.method === undefined)
			throw new Error('should not happen');

		const route = matchRoute(routes, { method: req.method, url: req.url });

		if (!route) {
			res.statusCode = 404;
			res.end('Not Found');
			return;
		}

		await processRequest(route, req as HttpRequest, res, { logger });
	};
}

function getRoutes(routers: Router[]) {
	return routers.flatMap((router) =>
		router.routes.map((route) => ({
			...route,
			path: [router.prefix, route.path].join('/'),
		}))
	);
}
