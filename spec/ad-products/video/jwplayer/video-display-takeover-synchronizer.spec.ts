import { expect } from 'chai';

import { VideoDisplayTakeoverSynchronizer } from '@wikia/ad-products';
import { context, targetingService } from '@wikia/core';

function setBundles(bundles) {
	window.fandomContext.site = window.fandomContext.site || {};
	window.fandomContext.site.tags = window.fandomContext.site.tags = {};
	window.fandomContext.site.tags.bundles = bundles;
}

describe('VideoDisplayTakeoverSynchronizer', () => {
	beforeEach(() => {
		context.set('options.jwpMaxDelayTimeout', 1);
		context.set('options.video.uapJWPLineItemIds', [1]);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.syncWithDisplay', true);
		context.set('options.video.displayAndVideoAdsSyncSetupEnabled', false);
	});

	afterEach(() => {
		context.remove('options.jwpMaxDelayTimeout');
		context.remove('options.video.uapJWPLineItemIds');
		context.remove('custom.hasFeaturedVideo');
		context.remove('options.video.syncWithDisplay');
		context.remove('options.video.displayAndVideoAdsSyncSetupEnabled');
		targetingService.clear();
	});

	it('disables sync on non FV page', () => {
		context.set('custom.hasFeaturedVideo', false);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});

	it('enables sync when flag is true', () => {
		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('enables sync on tentpole bundle', () => {
		context.set('options.video.syncWithDisplay', 'tentpole');
		setBundles(['tentpole']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('disables sync on tentpole bundle when it is not set', () => {
		context.set('options.video.syncWithDisplay', 'tentpole');
		setBundles([]);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});

	it('enables sync on tentpoles bundle', () => {
		context.set('options.video.syncWithDisplay', ['tentpole1', 'tentpole2', 'tentpole3']);
		setBundles(['tentpole1', 'tentpole4']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('disables sync on tentpoles bundle if non matches', () => {
		context.set('options.video.syncWithDisplay', ['tentpole1', 'tentpole2', 'tentpole3']);
		setBundles(['tentpole4', 'tentpole5', 'tentpole6']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});

	it('enabled sync using gnre key val', () => {
		context.set('options.video.syncWithDisplay', ['gnre=anime', 'bundles=my_bundle']);
		setBundles(['not_my_bundle']);
		targetingService.set('gnre', ['anime', 'movie']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('enabled sync using bundle key val', () => {
		context.set('options.video.syncWithDisplay', ['gnre=poetry', 'bundles=my_bundle']);
		targetingService.set('bundles', ['my_bundle']);
		targetingService.set('gnre', ['anime', 'movie']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('should not brake on invalid key-val', () => {
		context.set('options.video.syncWithDisplay', ['=my_bundle', '', '=']);

		expect(new VideoDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});
});
