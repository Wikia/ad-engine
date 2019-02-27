/* global browser */
const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.wdioEnvironment = 'mobile';

exports.config = merge(
	wdioConf.config,
	{
		specs: ['tests/specs/**/*.mobile.test.js'],
		exclude: ['tests/specs/**/*.desktop.test.js'],
		capabilities: [
			{
				browserName: 'chrome',
				chromeOptions: {
					mobileEmulation: {
						deviceName: 'iPhone X',
					},
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
