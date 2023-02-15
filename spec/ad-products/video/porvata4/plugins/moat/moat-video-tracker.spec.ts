import { PorvataSettings } from '@wikia/ad-products';
import { moatVideoTracker } from '@wikia/ad-products/video/porvata/plugins/moat/moat-video-tracker';
import { context, slotService, utils } from '@wikia/core';
import { assert } from 'chai';

describe('MOAT video tracker', () => {
	function createVideoSettings(moatTracking = true): PorvataSettings {
		return new PorvataSettings({
			moatTracking,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'bar',
		});
	}

	beforeEach(() => {
		global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve(new Event('foo')));
		global.sandbox.stub(slotService, 'get').returns({
			getConfigProperty: () => ({ isVideo: true }),
		} as any);

		context.set('options.video.moatTracking.partnerCode', 'bar');
	});

	it('is enabled when moatTracking is truthy in PorvataSettings', () => {
		assert.isTrue(moatVideoTracker.isEnabled(createVideoSettings()));
	});

	it('is disabled when moatTracking is falsy in PorvataSettings', () => {
		assert.isFalse(moatVideoTracker.isEnabled(createVideoSettings(false)));
	});
});
