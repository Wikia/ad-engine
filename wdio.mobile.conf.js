/* global browser */
/* eslint-disable import/no-extraneous-dependencies */

const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.envIsDesktop = false;

exports.config = merge(
	wdioConf.config,
	{
		specs: ['tests/specs/**/*.mobile.test.js'],
		exclude: ['tests/specs/**/*.desktop.test.js'],
		capabilities: [
			{
				maxInstances: 5,
				browserName: 'chrome',
				"goog:chromeOptions": {
					"args": [  "--window-size=1600,900", "--disable-infobars", "--disable-notifications" ],
					"mobileEmulation": { "deviceName": "iPhone X" }
				}
			}
		],
	},
	{clone: false},
);
