import { PorvataPlayer, PorvataSettings } from '@wikia/ad-products';
import { iasVideoTracker } from '@wikia/ad-products/video/porvata/plugins/ias/ias-video-tracker';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { AdSlot, context, slotService, utils } from '../../../../../../src/ad-engine';

describe('IAS video tracker', () => {
	const sandbox = sinon.createSandbox();

	function createVideoSettings(iasTracking: boolean = true): PorvataSettings {
		return new PorvataSettings({
			iasTracking,
			container: document.createElement('div'),
			slotName: 'foo',
			src: 'bar',
		});
	}

	function createPlayer(): PorvataPlayer {
		return {
			getAdsManager: () => {},
			dom: {
				getVideoContainer: () => {},
			},
		} as PorvataPlayer;
	}

	beforeEach(() => {
		window.googleImaVansAdapter = {
			init: () => {},
		};

		sandbox.stub(window.googleImaVansAdapter, 'init');
		sandbox.stub(utils.scriptLoader, 'loadScript').returns(Promise.resolve(new Event('foo')));

		sandbox.stub(slotService, 'get').returns({
			getTargeting: () => ({
				src: 'bar',
				pos: 'foo_pos',
				loc: 'foo_loc',
			}),
			getConfigProperty(key: string): any {},
		} as AdSlot);

		context.set('options.video.iasTracking.config', {
			anId: '1',
			campId: '2',
			chanId: '3',
			pubOrder: '4',
			placementId: '5',
			pubCreative: '6',
			pubId: '7',
		});
	});

	afterEach(() => {
		sandbox.restore();
		delete window['googleImaVansAdapter'];
	});

	it('is enabled when iasTracking is truthy in PorvataSettings', () => {
		assert.isTrue(iasVideoTracker.isEnabled(createVideoSettings()));
	});

	it('is disabled when iasTracking is falsy in PorvataSettings', () => {
		assert.isFalse(iasVideoTracker.isEnabled(createVideoSettings(false)));
	});

	it('calls googleImaVansAdapter on init', async () => {
		const settings = createVideoSettings();

		await iasVideoTracker.init(createPlayer(), settings);

		assert.isTrue(window.googleImaVansAdapter.init.calledOnce);

		const callArguments = window.googleImaVansAdapter.init.getCall(0).args;

		assert.deepEqual(callArguments[3], {
			anId: '1',
			campId: '2',
			chanId: '3',
			pubOrder: '4',
			placementId: '5',
			pubCreative: '6',
			pubId: '7',
			custom: 'bar',
			custom2: 'foo_pos',
			custom3: 'foo_loc',
		});
	});
});
