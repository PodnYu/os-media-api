import { Route } from './types';

// extra simple route matching
export function matchRoute(
	routes: Route[],
	{ method, url }: { method: string; url: string }
) {
	return routes.find(
		(route) => route.method === method && pathMatches(route.path, url)
	);
}

function pathMatches(pathSpec: string, path: string) {
	const specParts = pathSpec.split('/');
	const parts = path.split('/');

	return parts.every((p, i) => {
		return specParts[i]?.startsWith(':') || p === specParts[i];
	});
}
