/* eslint-disable */
const sinon = require('sinon');

exports.mochaHooks = {
	beforeEach() {
		global.sandbox = sinon.createSandbox();
	},

	afterEach() {
		global.sandbox.restore();
	},
};
/* eslint-enable */
