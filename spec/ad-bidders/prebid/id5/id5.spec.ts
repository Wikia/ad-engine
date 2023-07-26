import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { id5 } from '@wikia/ad-bidders/prebid/id5';
import { context } from '@wikia/core';
import { expect } from 'chai';

const bidderConfig = {
	enabled: false,
};

describe('Id5', () => {
	const id5EnabledConfig = {
		name: 'id5Id',
		params: {
			partner: 1139,
			abTesting: {
				enabled: false,
				controlGroupPct: 0.5,
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
		context.set('options.optOutSale', false);
		window.fandomContext.partners.directedAtChildren = false;
		context.set('bidders.prebid.id5AbValue', undefined);
	});

	after(() => {
		window.fandomContext.partners.directedAtChildren = false;
	});

	it('Prebid config includes Id5 setup', () => {
		const prebid = new PrebidProvider(bidderConfig);
		const id5Config = id5.getConfig();

		expect(prebid.prebidConfig.userSync.userIds[0]).to.eql(id5Config);
	});

	it('Id5 is enabled', () => {
		expect(id5.getConfig()).to.eql(id5EnabledConfig);
	});

	it('Id5 is disabled by feature flag', () => {
		context.set('bidders.prebid.id5', false);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 A/B testing is disabled when no value is set in context', () => {
		expect(id5.getConfig().params.abTesting.enabled).to.eql(false);
	});

	it('Id5 A/B testing value is set with the one taken from context', () => {
		context.set('bidders.prebid.id5AbValue', 0.9);

		expect(id5.getConfig().params.abTesting.controlGroupPct).to.eql(0.9);
	});
});
