import { liveRampAts, LiveRampAtsTypes } from '@wikia/ad-bidders';
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
		const liveRampConfig = liveRampAts.getConfig();

		expect(prebid.prebidConfig.userSync.userIds).to.deep.own.include(liveRampConfig);
	});

	it('LiveRamp is enabled', () => {
		const liveRampEnabledConfig = {
			name: 'identityLink',
			params: {
				pid: LiveRampAtsTypes.PLACEMENT_ID,
			},
			storage: {
				type: 'html5',
				name: LiveRampAtsTypes.ENVELOPE_STORAGE_NAME,
				expires: 1,
				refreshInSeconds: 1800,
			},
		};

		expect(liveRampAts.getConfig()).to.eql(liveRampEnabledConfig);
	});

	it('Live Ramp is disabled by feature flag', () => {
		context.set('bidders.liveRampId.enabled', false);

		expect(liveRampAts.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

		expect(liveRampAts.getConfig()).to.eql(undefined);
	});

	it('Live Ramp is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(liveRampAts.getConfig()).to.eql(undefined);
	});
});
