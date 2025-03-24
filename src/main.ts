import { loadEnvFile } from './utils/load-env';

loadEnvFile('.env');

import { createApp } from './http/app';
import { config } from './config';
import { logger } from './services';
import { routers } from './routes';

const PORT = config.port;

start();

async function start() {
	const server = createApp({ routers, logger });

	server.listen(PORT, () => {
		logger.info(`listening on :${PORT}...`);
	});

	['SIGINT', 'SIGTERM'].forEach((sig) => {
		process.on(sig, () => {
			logger.info(`got ${sig} signal, exiting...`);

			server.close();
		});
	});
}
