import { id5 } from '@wikia/ad-bidders/prebid/id5';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Id5', () => {
	const id5EnabledConfig = {
		name: 'id5Id',
		params: {
			partner: 1139,
			abTesting: {
				enabled: false,
				controlGroupPct: undefined,
			},
		},
		storage: {
			type: 'html5',
			name: 'id5id',
			expires: 90,
			refreshInSeconds: 8 * 3600,
		},
	};

	beforeEach(() => {
		context.set('bidders.prebid.id5', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		window.fandomContext.partners.directedAtChildren = false;
	});

	afterEach(() => {
		global.sandbox.restore();
	});

	after(() => {
		window.fandomContext.partners.directedAtChildren = undefined;
	});

	it('Id5 is enabled', () => {
		expect(id5.getConfig()).to.eql(id5EnabledConfig);
	});

	it('Id5 is disabled by feature flag', () => {
		context.set('bidders.prebid.id5', false);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled if user has opted out sale in GDPR', () => {
		context.set('options.trackingOptIn', false);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled if user has opted out sale in US', () => {
		context.set('options.optOutSale', true);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(id5.getConfig()).to.eql(undefined);
	});
});
