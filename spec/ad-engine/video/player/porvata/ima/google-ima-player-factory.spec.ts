import { expect } from 'chai';
import sinon from 'sinon';
import { AdSlot } from '../../../../../../src/ad-engine/models/ad-slot';
import { context } from '../../../../../../src/ad-engine/services/context-service';
import { slotService } from '../../../../../../src/ad-engine/services/slot-service';
import { googleImaPlayerFactory } from '../../../../../../src/ad-engine/video/player/porvata/ima/google-ima-player-factory';
import ConfigMock from '../../../../config-mock';

let mocks = {};

describe('google-ima-player', () => {
	beforeEach(() => {
		mocks = {
			adDisplayContainer: {
				initialize: () => {},
			},
			adsLoader: {
				addEventListener: () => {},
				contentComplete: () => {},
				removeEventListener: () => {},
				requestAds: () => {},
			},
			adsManager: {
				destroy: () => {},
				dispatchEvent: () => {},
				init: () => {},
				start: () => {},
				resize: () => {},
			},
			domElement: {
				style: {},
				classList: {
					add: () => {},
				},
			},
			videoParams: {
				container: {
					classList: {
						add: () => {},
					},
					querySelector: () => mocks.domElement,
				},
				height: 100,
				slotName: 'top_leaderboard',
				width: 100,
			},
			videoSettings: {
				get(key) {
					return mocks.videoParams[key];
				},
				getParams() {
					return mocks.videoParams;
				},
				getContainer() {
					return mocks.videoParams.container;
				},
			},
		};
		window.google = {
			ima: {
				// tslint:disable-next-line
				AdsRequest: function() {},
				ViewMode: {
					NORMAL: 0,
				},
			},
		};

		context.extend(ConfigMock);
		slotService.add(new AdSlot({ id: 'top_leaderboard' }));
	});

	it('request ads on create', () => {
		sinon.spy(mocks.adsLoader, 'requestAds');

		googleImaPlayerFactory.create(mocks.adDisplayContainer, mocks.adsLoader, mocks.videoSettings);

		expect(mocks.adsLoader.requestAds.calledOnce).to.be.ok;
	});

	it('set auto play flags when autoPlay is enabled', () => {
		sinon.spy(mocks.adsLoader, 'requestAds');

		mocks.videoParams.autoPlay = true;
		const player = googleImaPlayerFactory.create(
			mocks.adDisplayContainer,
			mocks.adsLoader,
			mocks.videoSettings,
		);

		expect(player.videoAd.autoplay).to.be.ok;
		expect(player.videoAd.muted).to.be.ok;
	});

	it('destroy ad and request new when reload is called', () => {
		sinon.spy(mocks.adsManager, 'destroy');
		sinon.spy(mocks.adsLoader, 'contentComplete');
		sinon.spy(mocks.adsLoader, 'requestAds');

		const player = googleImaPlayerFactory.create(
			mocks.adDisplayContainer,
			mocks.adsLoader,
			mocks.videoSettings,
		);

		player.setAdsManager(mocks.adsManager);

		player.reload();
		expect(mocks.adsManager.destroy.calledOnce).to.be.ok;
		expect(mocks.adsLoader.contentComplete.calledOnce).to.be.ok;
		expect(mocks.adsLoader.requestAds.calledTwice).to.be.ok; // 1x reload, 1x on factory::create
	});

	it('initialize adsManager and adDisplayContainer on video play', () => {
		sinon.spy(mocks.adDisplayContainer, 'initialize');
		sinon.spy(mocks.adsManager, 'init');
		sinon.spy(mocks.adsManager, 'start');

		const player = googleImaPlayerFactory.create(
			mocks.adDisplayContainer,
			mocks.adsLoader,
			mocks.videoSettings,
		);

		player.setAdsManager(mocks.adsManager);

		player.playVideo();
		expect(mocks.adDisplayContainer.initialize.calledOnce).to.be.ok;
		expect(mocks.adsManager.init.calledOnce).to.be.ok;
		expect(mocks.adsManager.start.calledOnce).to.be.ok;
	});

	it('resize player using adsManager', () => {
		sinon.spy(mocks.adsManager, 'resize');

		const player = googleImaPlayerFactory.create(
			mocks.adDisplayContainer,
			mocks.adsLoader,
			mocks.videoSettings,
		);

		player.setAdsManager(mocks.adsManager);

		player.resize();
		expect(mocks.adsManager.resize.calledOnce).to.be.ok;
	});
});
