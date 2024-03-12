import { InstantConfigService, targetingService } from '@wikia/core';
import { DataWarehouseTracker, TrackingSetup, trackingUrls } from '@wikia/platforms/shared';
import { LabradorTracker } from '@wikia/platforms/shared/tracking/labrador-tracker';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

describe('TrackingSetup', () => {
	const dwTracker = new DataWarehouseTracker();
	const labradorTracker = new LabradorTracker(dwTracker);
	const instantConfig = new InstantConfigService({
		appName: 'testapp',
	});
	let trackSpy: SinonSpy;

	beforeEach(() => {
		trackSpy = global.sandbox.spy(dwTracker, 'track');
	});

	afterEach(() => {
		targetingService.clear();
	});

	it('should track keyvals', (done) => {
		// given
		targetingService.clear();
		targetingService.set('key1', 'value1');
		const trackingSetup = new TrackingSetup(labradorTracker, dwTracker, instantConfig);

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
		targetingService.clear();
		targetingService.set('ppid', 'ppid');
		targetingService.set('topics_available', '1');
		// @ts-expect-error Feature Policy API is not available in TS
		global.window.document.featurePolicy = {
			allowsFeature: (feature: string) => feature === 'browsing-topics',
		};
		// @ts-expect-error Google Topics API is not available in TS
		global.window.document.browsingTopics = () => Promise.resolve(['topic1', 'topic2']);
		const trackingSetup = new TrackingSetup(labradorTracker, dwTracker, instantConfig);

		// when
		trackingSetup.execute();

		// then
		setTimeout(() => {
			targetingService.clear();
			expect(
				trackSpy
					.getCall(trackSpy.callCount - 1)
					.calledWithExactly({ ppid: 'ppid', topic: '["topic1","topic2"]' }, trackingUrls.TOPICS),
			).to.be.true;
			done();
		});
	});
});
