/* global browser */
/* eslint-disable import/no-extraneous-dependencies */

const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.envIsDesktop = false;

exports.config = merge(
	wdioConf.config,
	{
		suites: {
			bidders: ['./tests/specs/bidders/*.mobile.test.js'],
			hiviTemplates: ['./tests/specs/templates/hivi/*.mobile.test.js'],
			otherTemplates: ['./tests/specs/templates/non-hivi/*.mobile.test.js'],
			services: ['./tests/specs/services/*.mobile.test.js'],
			slots: ['./tests/specs/slots/*.mobile.test.js'],
			utils: ['./tests/specs/utils/*.mobile.test.js'],
			video: ['./tests/specs/video/*.mobile.test.js'],
		},
		specs: ['tests/specs/**/*.mobile.test.js'],
		exclude: ['tests/specs/**/*.desktop.test.js'],
		capabilities: [
			{
				maxInstances: 5,
				browserName: 'chrome',
				'goog:chromeOptions': {
					args: ['--window-size=1600,900', '--disable-infobars', '--disable-notifications'],
					mobileEmulation: { deviceName: 'iPhone X' },
				},
			},
		],
	},
	{ clone: false },
);
