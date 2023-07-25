import { Ats, liveRamp } from '@wikia/ad-bidders';
import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context } from '@wikia/core';
import { expect } from 'chai';

const bidderConfig = {
	enabled: false,
};

describe('Live Ramp', () => {
	beforeEach(() => {
		context.set('bidders.liveRampId.enabled', true);
		context.set('options.optOutSale', false);
		window.fandomContext.partners.directedAtChildren = false;
	});

	it('Prebid config includes LiveRamp setup', () => {
		const prebid = new PrebidProvider(bidderConfig);
		const liveRampConfig = liveRamp.getConfig();

		expect(prebid.prebidConfig.userSync.userIds[0]).to.eql(liveRampConfig);
	});

	it('LiveRamp is enabled', () => {
		const liveRampEnabledConfig = {
			name: 'identityLink',
			params: {
				pid: Ats.PLACEMENT_ID,
			},
			storage: {
				type: 'html5',
				name: Ats.ENVELOPE_STORAGE_NAME,
				expires: 1,
				refreshInSeconds: 1800,
			},
		};

		expect(liveRamp.getConfig()).to.eql(liveRampEnabledConfig);
	});

	it('Live Ramp is disabled by feature flag', () => {
		context.set('bidders.liveRampId.enabled', false);

		expect(liveRamp.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

		expect(liveRamp.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(liveRamp.getConfig()).to.eql(undefined);
	});
});
