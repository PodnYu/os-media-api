const mw1 = async (next) => {
	console.log('1');
	await new Promise((res) => setTimeout(res, 2000));
	next();
};

const mw2 = async (next) => {
	console.log('2');
	await new Promise((res) => setTimeout(res, 2000));
	next();
};

const mw3 = async (next) => {
	console.log('3');
};

const mws = [mw1, mw2, mw3];

start();

async function start() {
	let i = 0;

	function next() {
		if (i > mws.length) return;
		mws[i++](next);
	}

	next();
}
