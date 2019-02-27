/* global browser */
const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.wdioEnvironment = 'desktop';

exports.config = merge(
	wdioConf.config,
	{
		specs: ['tests/specs/**/*.desktop.test.js'],
		exclude: ['tests/specs/**/*.mobile.test.js'],
		capabilities: [
			{
				browserName: 'chrome',
				loggingPrefs: {
					browser: 'ALL',
				},
				chromeOptions: {
					args: ['--disable-dev-shm-usage', '--no-sandbox'],
				},
			},
		],
		before() {
			browser.windowHandleSize({ width: 1600, height: 900 });
		},
		after() {
			browser.windowHandleSize({ width: 1600, height: 900 });
		},
	},
	{ clone: false },
);
