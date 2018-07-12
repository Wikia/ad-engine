import { expect } from 'chai';
import { trackingOptIn } from '../../src/services/tracking-opt-in';

let vendorConsents = 50;

function setupCmp() {
	window.__cmp = (cmd, params, cb) => {
		cb({
			metadata: 'BOQu5naOQu5naCNABAAABRAAAAAAAA',
			purposeConsents: Array.from({ length: 5 }).reduce((map, val, i) => {
				map[i + 1] = true;
				return map;
			}, {}),
			vendorConsents: Array.from({ length: vendorConsents }).reduce((map, val, i) => {
				map[i + 1] = true;
				return map;
			}, {})
		});
	};
}

describe('tracking-opt-in', () => {
	beforeEach(() => {
		delete window.__cmp;
		vendorConsents = 50;
	});

	it('is opted in when __cmp is not defined', () => {
		expect(trackingOptIn.isOptedIn()).to.be.ok;
	});

	it('is not opted in when __cmp is not read', () => {
		setupCmp();

		expect(trackingOptIn.isOptedIn()).to.not.be.ok;
	});

	it('is opted in when __cmp has consents', () => {
		setupCmp();

		trackingOptIn.readConsent();

		expect(trackingOptIn.isOptedIn()).to.be.ok;
	});

	it('is not opted in when __cmp does not have consents', () => {
		vendorConsents = 0;
		setupCmp();

		trackingOptIn.readConsent();

		expect(trackingOptIn.isOptedIn()).to.not.be.ok;
	});
});
