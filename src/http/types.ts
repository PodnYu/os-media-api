import { IncomingMessage, ServerResponse } from 'http';

export type Params = Record<string, string>;

export type HttpRequest = IncomingMessage & { url: string; method: string } & {
	params: Params;
};
export type HttpResponse = ServerResponse;

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type Handler = (req: HttpRequest, res: HttpResponse) => Promise<void>;

export type Middleware = (
	req: HttpRequest,
	res: HttpResponse,
	next: () => Promise<void>
) => Promise<void>;

export type Route = {
	path: string;
	method: Method;
	handler: Handler;
	middleware?: Middleware[];
};

export type Router = {
	prefix?: string;
	routes: Route[];
};
