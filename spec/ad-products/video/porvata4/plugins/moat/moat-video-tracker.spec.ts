import { PorvataSettings } from '@wikia/ad-products';
import { moatVideoTracker } from '@wikia/ad-products/video/porvata/plugins/moat/moat-video-tracker';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { context, slotService, utils } from '../../../../../../src/core';

describe('MOAT video tracker', () => {
	const sandbox = sinon.createSandbox();

	function createVideoSettings(moatTracking = true): PorvataSettings {
		return new PorvataSettings({
			moatTracking,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'bar',
		});
	}

	beforeEach(() => {
		sandbox.stub(utils.scriptLoader, 'loadScript').returns(Promise.resolve(new Event('foo')));
		sandbox.stub(slotService, 'get').returns({
			getConfigProperty: () => ({ isVideo: true }),
		} as any);

		context.set('options.video.moatTracking.partnerCode', 'bar');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('is enabled when moatTracking is truthy in PorvataSettings', () => {
		assert.isTrue(moatVideoTracker.isEnabled(createVideoSettings()));
	});

	it('is disabled when moatTracking is falsy in PorvataSettings', () => {
		assert.isFalse(moatVideoTracker.isEnabled(createVideoSettings(false)));
	});
});
