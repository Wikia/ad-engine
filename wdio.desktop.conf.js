/* global browser */
/* eslint-disable import/no-extraneous-dependencies */

const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.envIsDesktop = true;

exports.config = merge(
	wdioConf.config,
	{
		specs: ['tests/specs/**/*.desktop.test.js'],
		exclude: ['tests/specs/**/*.mobile.test.js'],
		capabilities: [
			{
				maxInstances: 5,
				browserName: 'chrome',
				"goog:chromeOptions": {
					"args": [  "--window-size=1600,900","--disable-dev-shm-usage", "--no-sandbox", "--disable-infobars", "--disable-notifications" ],
				}
			},
		],
	},
	{ clone: false },
);
