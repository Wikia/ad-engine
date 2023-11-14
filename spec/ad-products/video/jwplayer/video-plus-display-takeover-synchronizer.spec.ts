import { expect } from 'chai';

import { VideoPlusDisplayTakeoverSynchronizer } from '@wikia/ad-products';
import { context } from '@wikia/core';

function setBundles(bundles) {
	window.fandomContext.site = window.fandomContext.site || {};
	window.fandomContext.site.tags = window.fandomContext.site.tags = {};
	window.fandomContext.site.tags.bundles = bundles;
}

describe('VideoPlusDisplayTakeoverSynchronizer', () => {
	beforeEach(() => {
		context.set('options.jwpMaxDelayTimeout', 1);
		context.set('options.video.uapJWPLineItemIds', [1]);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.syncWithDisplay', true);
	});

	it('disables sync on non FV page', () => {
		context.set('custom.hasFeaturedVideo', false);

		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});

	it('enables sync when flag is true', () => {
		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('enables sync on tentpole bundle', () => {
		context.set('options.video.syncWithDisplay', 'tentpole');
		setBundles(['tentpole']);

		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('disables sync on tentpole bundle when it is not set', () => {
		context.set('options.video.syncWithDisplay', 'tentpole');
		setBundles([]);

		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});

	it('enables sync on tentpoles bundle', () => {
		context.set('options.video.syncWithDisplay', ['tentpole1', 'tentpole2', 'tentpole3']);
		setBundles(['tentpole1', 'tentpole4']);

		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.true;
	});

	it('disables sync on tentpoles bundle if non matches', () => {
		context.set('options.video.syncWithDisplay', ['tentpole1', 'tentpole2', 'tentpole3']);
		setBundles(['tentpole4', 'tentpole5', 'tentpole6']);

		expect(new VideoPlusDisplayTakeoverSynchronizer().isRequiredToRun()).to.be.false;
	});
});
