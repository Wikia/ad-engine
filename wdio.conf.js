const StaticFilesServer = require('./tests/libs/static-files-server');
const AD_ENGINE_PORT = process.env.AD_ENGINE_PORT || 8080;

exports.config = {
	suites: {
		bidders: ['./tests/specs/bidders/*.test.js'],
		hiviTemplates: ['./tests/specs/templates/hivi/*.test.js'],
		otherTemplates: ['./tests/specs/templates/non-hivi/*.test.js'],
		services: ['./tests/specs/services/*.test.js'],
		slots: ['./tests/specs/slots/*.test.js'],
		utils: ['./tests/specs/utils/*.test.js'],
		video: ['./tests/specs/video/*.test.js'],
	},
	runner: 'local',
	maxInstances: 5,
	logLevel: 'error',
	bail: 0,
	baseUrl: `http://localhost:${AD_ENGINE_PORT}`,
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	services: ['selenium-standalone', 'devtools', [StaticFilesServer]],
	framework: 'mocha',
	reporters: ['spec'],
	mochaOpts: {
		ui: 'bdd',
		compilers: ['js:@babel/register'],
		timeout: 6000000,
	},
	staticFilesServerConfig: {
		basename: '/',
		mount: './examples',
		port: AD_ENGINE_PORT,
	},
};
