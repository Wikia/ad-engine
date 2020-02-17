import { assert } from 'chai';
import * as sinon from 'sinon';
import { context, utils } from '../../../../../../src/ad-engine';
import { moatVideoTracker } from '../../../../../../src/ad-products/video/porvata4/plugins/moat/moat-video-tracker';
import { PorvataSettings } from '../../../../../../src/ad-products/video/porvata4/porvata-settings';

describe('MOAT video tracker', () => {
	const sandbox = sinon.createSandbox();

	function createVideoSettings(moatTracking: boolean = true) {
		return new PorvataSettings({
			container: document.createElement('div'),
			moatTracking,
			slotName: 'foo',
			src: 'bar',
		});
	}

	beforeEach(() => {
		sandbox.stub(utils.scriptLoader, 'loadScript').returns(Promise.resolve(new Event('foo')));

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
