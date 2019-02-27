const portfinder = require('portfinder');

const properties = {};

if (process.argv[2] && process.argv[3]) {
	const startPort = parseInt(process.argv[2], 10);
	const offset = parseInt(process.argv[3], 10);

	properties.port = startPort;
	properties.stopPort = startPort + offset;
}

portfinder.getPort(properties, (err, port) => {
	console.log(port);
});
