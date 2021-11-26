import { liveRamp } from '@wikia/ad-bidders';
import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

const bidderConfig = {
	lazyLoadingEnabled: false,
	enabled: false,
};

describe('Live Ramp', () => {
	const sandbox = createSandbox();
	const liveRampEnabledConfig = {
		userSync: {
			userIds: [
				{
					name: 'identityLink',
					params: {
						pid: '2161',
					},
					storage: {
						type: 'cookie',
						name: 'idl_env',
						expires: 1,
					},
				},
			],
		},
	};
	const liveRampDisabledConfig = {};

	beforeEach(() => {
		context.set('bidders.liveRampId.enabled', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Prebid config includes LiveRamp setup', () => {
		const prebid = new PrebidProvider(bidderConfig);
		const liveRampConfig = liveRamp.getConfig();

		expect(prebid.prebidConfig.userSync).to.have.key('userIds');
		expect(prebid.prebidConfig.userSync.userIds).to.eql(liveRampConfig.userSync.userIds);
	});

	it('LiveRamp is enabled', () => {
		expect(liveRamp.getConfig()).to.eql(liveRampEnabledConfig);
	});

	it('Live Ramp is disabled by feature flag', () => {
		context.set('bidders.liveRampId.enabled', false);

		expect(liveRamp.getConfig()).to.eql(liveRampDisabledConfig);
	});

	it('Live Ramp is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

		expect(liveRamp.getConfig()).to.eql(liveRampDisabledConfig);
	});

	it('Live Ramp is disabled on child-directed wiki', () => {
		context.set('wiki.targeting.directedAtChildren', true);

		expect(liveRamp.getConfig()).to.eql(liveRampDisabledConfig);
	});
});
