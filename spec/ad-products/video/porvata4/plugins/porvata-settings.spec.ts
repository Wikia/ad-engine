import { assert } from 'chai';
import { context } from '../../../../../src/ad-engine/services';
import { PorvataSettings } from '../../../../../src/ad-products/video/porvata4/porvata-settings';

describe('Porvata Settings wrapper', () => {
	let porvataSettings;

	beforeEach(() => {
		context.set('options.video.moatTracking.enabled', true);
		context.set('options.video.moatTracking.sampling', 50);

		porvataSettings = new PorvataSettings({
			adProduct: 'hivi',
			autoPlay: false,
			container: document.createElement('div'),
			height: 7,
			restartOnUnmute: false,
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
		assert.isFalse(porvataSettings.shouldRestartOnMute());
		assert.equal(porvataSettings.getSlotName(), 'foo');
		assert.equal(porvataSettings.getWidth(), 3);
		assert.equal(porvataSettings.getVastUrl(), 'http://example.com/foo');
		assert.equal(porvataSettings.getVpaidMode(), 2);
	});

	it('enables moatTracking when true is passed', () => {
		const settings = new PorvataSettings({
			moatTracking: true,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isTrue(settings.isMoatTrackingEnabled());
	});

	it('disables moatTracking when false is passed', () => {
		const settings = new PorvataSettings({
			moatTracking: false,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isFalse(settings.isMoatTrackingEnabled());
	});

	it('disables moatTracking based on context when there is no value passed', () => {
		context.set('options.video.moatTracking.enabled', false);

		const settings = new PorvataSettings({
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isFalse(settings.isMoatTrackingEnabled());
	});

	it('enables moatTracking when sampling is 100%', () => {
		context.set('options.video.moatTracking.sampling', 100);

		const settings = new PorvataSettings({
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'gpt',
		});

		assert.isTrue(settings.isMoatTrackingEnabled());
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
