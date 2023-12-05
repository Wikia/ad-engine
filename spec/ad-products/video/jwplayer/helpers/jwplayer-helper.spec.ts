import { expect } from 'chai';

import { JWPlayerConfig } from '@wikia/ad-products/video/jwplayer/external-types/jwplayer-config';
import { JWPlayerListItem } from '@wikia/ad-products/video/jwplayer/external-types/jwplayer-list-item';
import { JWPlayerHelper } from '@wikia/ad-products/video/jwplayer/helpers/jwplayer-helper';
import { JwpState } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-state';
import { context, slotService, VastParams } from '@wikia/core';

type shouldPrerollAppear = boolean;
type shouldMidrollAppear = boolean;
type shouldPostrollAppear = boolean;
type videoTestRow = [shouldPrerollAppear, shouldMidrollAppear, shouldPostrollAppear];

describe('JWPlayerHelper', () => {
	let adSlotStub, jwplayerMock, helper;

	describe('should play pre-, mid- and post-rolls depending on the settings', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: global.sandbox.stub().returns(true),
			};

			helper = new JWPlayerHelper(adSlotStub, null, null);

			context.set('options.video.playAdsOnNextVideo', true);
			context.set('options.video.isMidrollEnabled', false);
			context.set('options.video.isPostrollEnabled', false);
		});

		afterEach(() => {
			context.remove('options.video.playAdsOnNextVideo');
			context.remove('options.video.isMidrollEnabled');
			context.remove('options.video.isPostrollEnabled');
		});

		it('works correctly for the default settings - no ad for the 2nd video, no midroll, no postroll', () => {
			simulatePlaysAndVerifyResults([
				[true, false, false],
				[false, false, false],
				[false, false, false],
			]);
		});

		it('works correctly when mid- and post-rolls are enabled - no ad for the 2nd video', () => {
			context.set('options.video.isMidrollEnabled', true);
			context.set('options.video.isPostrollEnabled', true);

			simulatePlaysAndVerifyResults([
				[true, true, true],
				[false, false, false],
				[false, false, false],
			]);
		});

		it('works correctly when the ads for next videos are disabled - only one preroll', () => {
			context.set('options.video.playAdsOnNextVideo', false);

			simulatePlaysAndVerifyResults([
				[true, false, false],
				[false, false, false],
				[false, false, false],
			]);
		});

		it('works correctly for the capping logic - ads before 1st and 3rd video, no midroll, no postroll', () => {
			context.set('options.video.forceVideoAdsOnAllVideosExceptSecond', false);
			context.set('options.video.adsOnNextVideoFrequency', 2);
			context.set('options.video.isMidrollEnabled', false);
			context.set('options.video.isPostrollEnabled', false);

			simulatePlaysAndVerifyResults([
				[true, false, false],
				[false, false, false],
				[true, false, false],
				[false, false, false],
			]);
		});

		function simulatePlaysAndVerifyResults(testData: videoTestRow[]): void {
			testData.forEach((expectedResults, videoPlayIndex) => {
				const videoNumber = videoPlayIndex + 1;
				expect(helper.shouldPlayPreroll(videoNumber)).to.equal(expectedResults[0]);
				expect(helper.shouldPlayMidroll(videoNumber)).to.equal(expectedResults[1]);
				expect(helper.shouldPlayPostroll(videoNumber)).to.equal(expectedResults[2]);
			});
		}
	});

	describe('playVideoAd() does two things', () => {
		const MOCKED_JWP_STATE = createFakeJwpState();

		beforeEach(() => {
			(adSlotStub = createFakeVideoAdSlot()),
				(jwplayerMock = {
					playAd: global.sandbox.stub(),
				});
			helper = new JWPlayerHelper(adSlotStub, jwplayerMock, null);

			context.set('options.video.playAdsOnNextVideo', true);
		});

		afterEach(() => {
			context.remove('options.video.playAdsOnNextVideo');
			context.remove('options.video.vastXml');
		});

		it('plays ad when VAST XML is not set in the context', () => {
			context.set('options.video.vastXml', undefined);
			slotService.add(adSlotStub);

			helper.playVideoAd('preroll', MOCKED_JWP_STATE as JwpState);

			expect(jwplayerMock.playAd.called).to.be.true;
		});

		it('restarts VAST XML once playVideoAd() called', () => {
			context.set('options.video.vastXml', '<fake-xml></fake-xml>');

			helper.playVideoAd('preroll', MOCKED_JWP_STATE as JwpState);

			expect(context.get('options.video.vastXml')).to.be.undefined;
			expect(jwplayerMock.playAd.called).to.be.false;
		});
	});

	function createFakeJwpState() {
		return {
			correlator: 1234567890,
			depth: 1,
			vastParams: {} as VastParams,
			playlistItem: {} as JWPlayerListItem,
			config: {} as JWPlayerConfig,
			mute: true,
			rv: 1,
			adInVideo: 'preroll',
		};
	}

	function createFakeVideoAdSlot() {
		return {
			getConfigProperty: global.sandbox.stub().returns({}),
			getElement: global.sandbox.stub().returns({}),
			getSlotName: global.sandbox.stub().returns('fake-video-slot'),
			getTargeting: global.sandbox.stub().returns({}),
			getVideoAdUnit: global.sandbox.stub().returns(''),
			getVideoSizes: global.sandbox.stub().returns(undefined),
			getCustomParameters: global.sandbox.stub().returns(''),
			isEnabled: global.sandbox.stub().returns(true),
			setConfigProperty: global.sandbox.stub().returns({}),
		};
	}
});
