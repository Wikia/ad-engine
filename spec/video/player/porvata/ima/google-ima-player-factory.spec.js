import sinon from 'sinon';
import GoogleImaPlayerFactory from '../../../../../src/video/player/porvata/ima/google-ima-player-factory';

let mocks = {};

QUnit.module('GoogleImaPlayer test', {
	beforeEach: () => {
		mocks = {
			adDisplayContainer: {
				initialize: () => {}
			},
			adsLoader: {
				addEventListener: () => {},
				contentComplete: () => {},
				removeEventListener: () => {},
				requestAds: () => {}
			},
			adsManager: {
				destroy: () => {},
				dispatchEvent: () => {},
				init: () => {},
				start: () => {},
				resize: () => {}
			},
			domElement: {
				style: {},
				classList: {
					add: () => {}
				}
			},
			params: {
				width: 100,
				height: 100,
				container: {
					querySelector: () => mocks.domElement
				}
			}
		};

		window.google = {
			ima: {
				AdsRequest: () => {},
				ViewMode: {
					NORMAL: 0
				}
			}
		};
	}
});

QUnit.test('Request ads on create', (assert) => {
	sinon.spy(mocks.adsLoader, 'requestAds');

	GoogleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.params);

	assert.ok(mocks.adsLoader.requestAds.calledOnce);
});

QUnit.test('Set auto play flags when autoPlay is enabled', (assert) => {
	sinon.spy(mocks.adsLoader, 'requestAds');

	mocks.params.autoPlay = true;
	const player = GoogleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.params);

	assert.ok(player.mobileVideoAd.autoplay);
	assert.ok(player.mobileVideoAd.muted);
});

QUnit.test('Destroy ad and request new when reload is called', (assert) => {
	sinon.spy(mocks.adsManager, 'destroy');
	sinon.spy(mocks.adsLoader, 'contentComplete');
	sinon.spy(mocks.adsLoader, 'requestAds');

	const player = GoogleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.params);
	player.setAdsManager(mocks.adsManager);

	player.reload();
	assert.ok(mocks.adsManager.destroy.calledOnce);
	assert.ok(mocks.adsLoader.contentComplete.calledOnce);
	assert.ok(mocks.adsLoader.requestAds.calledTwice); // 1x reload, 1x on factory::create
});

QUnit.test('Initialize adsManager and adDisplayContainer on video play', (assert) => {
	sinon.spy(mocks.adDisplayContainer, 'initialize');
	sinon.spy(mocks.adsManager, 'init');
	sinon.spy(mocks.adsManager, 'start');

	const player = GoogleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.params);
	player.setAdsManager(mocks.adsManager);

	player.playVideo();
	assert.ok(mocks.adDisplayContainer.initialize.calledOnce);
	assert.ok(mocks.adsManager.init.calledOnce);
	assert.ok(mocks.adsManager.start.calledOnce);
});

QUnit.test('Resize player using adsManager', (assert) => {
	sinon.spy(mocks.adsManager, 'resize');

	const player = GoogleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.params);
	player.setAdsManager(mocks.adsManager);

	player.resize();
	assert.ok(mocks.adsManager.resize.calledOnce);
});
