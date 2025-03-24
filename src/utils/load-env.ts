import fs from 'fs';

export function loadEnvFile(filePath = './.env') {
	const content = fs.readFileSync(filePath, 'utf8');

	content
		.split('\n')
		.filter((line) => line.includes('='))
		.map((line) => line.split('='))
		.forEach(([key, value]) => {
			process.env[key] = value;
		});
}
