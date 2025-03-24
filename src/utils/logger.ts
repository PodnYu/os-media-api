type Log = (msg: unknown) => void;

export type Logger = {
	info: Log;
	error: Log;
	warn: Log;
};

export function createLogger(): Logger {
	const log = (msg: unknown, level: string) =>
		console.log(
			JSON.stringify({
				ts: Date.now(),
				level,
				message: formatMsg(msg),
			})
		);

	return {
		info: (msg) => log(msg, 'INFO'),
		error: (msg) => log(msg, 'ERROR'),
		warn: (msg) => log(msg, 'WARN'),
	};
}

function formatMsg(msg: unknown) {
	if (msg instanceof Error)
		return {
			name: msg.name,
			message: msg.message,
			stack: msg.stack,
		};

	return msg;
}
