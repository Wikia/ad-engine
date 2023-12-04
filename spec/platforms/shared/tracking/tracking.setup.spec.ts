import { Bidders } from '@wikia/ad-bidders';
import { InstantConfigService, targetingService } from '@wikia/core';
import { GlobalTimeout } from '@wikia/core/utils';
import { DataWarehouseTracker, TrackingSetup, trackingUrls } from '@wikia/platforms/shared';
import { AdSizeTracker } from '@wikia/platforms/shared/tracking/ad-size-tracker';
import { LabradorTracker } from '@wikia/platforms/shared/tracking/labrador-tracker';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('TrackingSetup', () => {
	const dwTracker = new DataWarehouseTracker();
	const labradorTracker = new LabradorTracker(dwTracker);
	const adSizeTracker = new AdSizeTracker(dwTracker);
	const instantConfig = new InstantConfigService();
	const globalTimeout = new GlobalTimeout();
	const bidders = new Bidders(instantConfig, globalTimeout);
	let trackSpy: SinonSpy;

	beforeEach(() => {
		trackSpy = global.sandbox.spy(dwTracker, 'track');
	});

	it('should track keyvals', (done) => {
		// given
		targetingService.clear();
		targetingService.set('key1', 'value1');
		const trackingSetup = new TrackingSetup(
			labradorTracker,
			adSizeTracker,
			dwTracker,
			bidders,
			instantConfig,
		);

		// when
		trackingSetup.execute();

		// then
		setTimeout(() => {
			targetingService.clear();
			expect(
				trackSpy
					.getCall(trackSpy.callCount - 1)
					.calledWithExactly({ keyvals: '{"key1":"value1"}' }, trackingUrls.KEY_VALS),
			).to.be.true;
			done();
		});
	});

	it('should track Google Topics API when it is available', (done) => {
		// given
		// @ts-expect-error Feature Policy API is not available in TS
		global.window.document.featurePolicy = {
			allowsFeature: (feature: string) => feature === 'browsing-topics',
		};
		// @ts-expect-error Google Topics API is not available in TS
		global.window.document.browsingTopics = () => Promise.resolve(['topic1', 'topic2']);
		const trackingSetup = new TrackingSetup(
			labradorTracker,
			adSizeTracker,
			dwTracker,
			bidders,
			instantConfig,
		);

		// when
		trackingSetup.execute();

		// then
		setTimeout(() => {
			expect(
				trackSpy
					.getCall(trackSpy.callCount - 1)
					.calledWithExactly({ topic: '["topic1","topic2"]' }, trackingUrls.TOPICS),
			).to.be.true;
			done();
		});
	});
});
