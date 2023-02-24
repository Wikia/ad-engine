import { PorvataSettings } from '@wikia/ad-products';
import { context } from '@wikia/core';
import { assert } from 'chai';

describe('Porvata Settings wrapper', () => {
	let porvataSettings;

	beforeEach(() => {
		porvataSettings = new PorvataSettings({
			adProduct: 'hivi',
			autoPlay: false,
			container: document.createElement('div'),
			height: 7,
			slotName: 'foo',
			src: 'gpt',
			width: 3,
			vastTargeting: {},
			vastUrl: 'http://example.com/foo',
			vpaidMode: 2,
		});
	});

	it('returns passed values in constructor', () => {
		assert.equal(porvataSettings.getAdProduct(), 'hivi');
		assert.isFalse(porvataSettings.isAutoPlay());
		assert.equal(porvataSettings.getHeight(), 7);
		assert.equal(porvataSettings.getSlotName(), 'foo');
		assert.equal(porvataSettings.getWidth(), 3);
		assert.equal(porvataSettings.getVastUrl(), 'http://example.com/foo');
		assert.equal(porvataSettings.getVpaidMode(), 2);
	});

	it('enables iasTracking when true is passed', () => {
		const settings = new PorvataSettings({
			iasTracking: true,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isTrue(settings.isIasTrackingEnabled());
	});

	it('disables iasTracking when false is passed', () => {
		const settings = new PorvataSettings({
			iasTracking: false,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isFalse(settings.isIasTrackingEnabled());
	});

	it('disables iasTracking based on context when there is no value passed', () => {
		context.set('options.video.iasTracking.enabled', false);

		const settings = new PorvataSettings({
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isFalse(settings.isIasTrackingEnabled());
	});
});
