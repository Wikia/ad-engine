import { liveRampId, LiveRampIdTypes } from '@wikia/ad-bidders';
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
		const liveRampConfig = liveRampId.getConfig();

		expect(prebid.prebidConfig.userSync.userIds).to.deep.own.include(liveRampConfig);
	});

	it('LiveRamp is enabled', () => {
		const liveRampEnabledConfig = {
			name: 'identityLink',
			params: {
				pid: LiveRampIdTypes.PLACEMENT_ID,
			},
			storage: {
				type: 'html5',
				name: LiveRampIdTypes.ENVELOPE_STORAGE_NAME,
				expires: 1,
				refreshInSeconds: 1800,
			},
		};

		expect(liveRampId.getConfig()).to.eql(liveRampEnabledConfig);
	});

	it('Live Ramp is disabled by feature flag', () => {
		context.set('bidders.liveRampId.enabled', false);

		expect(liveRampId.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

		expect(liveRampId.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(liveRampId.getConfig()).to.eql(undefined);
	});
});
