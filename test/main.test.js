const http = require('http');
const fs = require('fs');
const assert = require('assert');

const COMMON_HTTP_OPTIONS = {
	host: 'localhost',
	port: 8080,
	headers: { 'content-type': 'text/plain' },
};

start();

async function start() {
	const id = '123';

	let r;

	r = await createObject(
		id,
		fs.createReadStream('./test/test-objects/test1.txt')
	);

	assert(r.statusCode === 201);

	r = await getObject(id);

	assert(r.statusCode === 200);

	r = await updateObject(
		id,
		fs.createReadStream('./test/test-objects/test2.txt')
	);

	assert(r.statusCode === 201);

	r = await deleteObject(id);

	assert(r.statusCode === 204);

	console.log('ok');
}

async function createObject(id, st) {
	return new Promise((resolve) => {
		const req = http.request(
			{
				method: 'POST',
				path: `/api/v1/objects/${id}`,
				...COMMON_HTTP_OPTIONS,
			},
			(res) => resolve(res)
		);

		st.pipe(req);
	});
}

async function getObject(id) {
	return new Promise((resolve) => {
		http
			.request(
				{
					method: 'GET',
					path: `/api/v1/objects/${id}`,
					...COMMON_HTTP_OPTIONS,
				},
				(res) => resolve(res)
			)
			.end();
	});
}

async function updateObject(id, st) {
	return new Promise((resolve) => {
		const req = http.request(
			{
				method: 'PUT',
				path: `/api/v1/objects/${id}`,
				...COMMON_HTTP_OPTIONS,
			},
			(res) => resolve(res)
		);

		st.pipe(req);
	});
}

async function deleteObject(id) {
	return new Promise((resolve) => {
		http
			.request(
				{
					method: 'DELETE',
					path: `/api/v1/objects/${id}`,
					...COMMON_HTTP_OPTIONS,
				},
				(res) => resolve(res)
			)
			.end();
	});
}
