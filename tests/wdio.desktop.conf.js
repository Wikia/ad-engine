/* global browser */
/* eslint-disable import/no-extraneous-dependencies */

const merge = require('deepmerge');
const wdioConf = require('./wdio.conf.js');

global.envIsDesktop = true;
global.platform = 'desktop';

exports.config = merge(
	wdioConf.config,
	{
		suites: {
			bidders: ['./tests/specs/bidders/*.desktop.test.js'],
			hiviTemplates: ['./tests/specs/templates/hivi/*.desktop.test.js'],
			otherTemplates: ['./tests/specs/templates/non-hivi/*.desktop.test.js'],
			services: ['./tests/specs/services/*.desktop.test.js'],
			slots: ['./tests/specs/slots/*.desktop.test.js'],
			utils: ['./tests/specs/utils/*.desktop.test.js'],
			video: ['./tests/specs/video/*.desktop.test.js'],
		},

		specs: ['tests/specs/**/*.desktop.test.js'],
		exclude: ['tests/specs/**/*.mobile.test.js'],
		capabilities: [
			{
				maxInstances: 5,
				browserName: 'chrome',
				'goog:chromeOptions': {
					args: [
						'--window-size=1600,900',
						'--disable-dev-shm-usage',
						'--no-sandbox',
						'--disable-infobars',
						'--disable-notifications',
					],
				},
			},
		],
	},
	{ clone: false },
);
