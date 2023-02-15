import { expect } from 'chai';

import { JwplayerHelperSkippingSponsoredVideo } from '@wikia/ad-products/video/jwplayer/helpers';
import { context } from '@wikia/core';

type shouldPrerollAppear = boolean;
type shouldMidrollAppear = boolean;
type shouldPostrollAppear = boolean;
type videoTestRow = [shouldPrerollAppear, shouldMidrollAppear, shouldPostrollAppear];

describe('JwplayerHelperSkippingSponsoredVideo', () => {
	let adSlotStub, helper;

	describe('should play pre-, mid- and post-rolls depending on the settings', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: global.sandbox.stub().returns(true),
			};
			window.sponsoredVideos = ['AbCd123e'];
			helper = new JwplayerHelperSkippingSponsoredVideo(
				adSlotStub,
				null,
				null,
				window.sponsoredVideos,
			);

			context.set('options.video.playAdsOnNextVideo', true);
			context.set('options.video.isMidrollEnabled', false);
			context.set('options.video.isPostrollEnabled', false);
		});

		afterEach(() => {
			window.sponsoredVideos = undefined;

			context.remove('options.video.playAdsOnNextVideo');
			context.remove('options.video.isMidrollEnabled');
			context.remove('options.video.isPostrollEnabled');
		});

		it('works correctly for the default settings - no ad for the 2nd video, no midroll, no postroll', () => {
			simulatePlaysAndVerifyResults([
				[true, false, false],
				[true, false, false],
				[true, false, false],
			]);
		});

		it('works correctly when mid- and post-rolls are enabled', () => {
			context.set('options.video.isMidrollEnabled', true);
			context.set('options.video.isPostrollEnabled', true);

			simulatePlaysAndVerifyResults([
				[true, true, true],
				[true, true, true],
				[true, true, true],
			]);
		});

		it('works correctly when the ads for next videos are disabled', () => {
			context.set('options.video.playAdsOnNextVideo', false);

			simulatePlaysAndVerifyResults([
				[false, false, false],
				[false, false, false],
				[false, false, false],
			]);
		});

		it('works correctly when the 3rd ad is a sponsored one', () => {
			window.sponsoredVideos = ['testMediaId-3'];
			helper = new JwplayerHelperSkippingSponsoredVideo(
				adSlotStub,
				null,
				null,
				window.sponsoredVideos,
			);

			simulatePlaysAndVerifyResults([
				[true, false, false],
				[true, false, false],
				[false, false, false],
			]);
		});

		it('works correctly when the 1st ad is a sponsored one', () => {
			window.sponsoredVideos = ['testMediaId-1'];
			helper = new JwplayerHelperSkippingSponsoredVideo(
				adSlotStub,
				null,
				null,
				window.sponsoredVideos,
			);

			simulatePlaysAndVerifyResults([
				[false, false, false],
				[true, false, false],
				[true, false, false],
			]);
		});

		it('works correctly when there is no global window.sponsoredVideos', (done) => {
			window.sponsoredVideos = undefined;
			helper = new JwplayerHelperSkippingSponsoredVideo(
				adSlotStub,
				null,
				null,
				window.sponsoredVideos,
			);
			done();

			simulatePlaysAndVerifyResults([
				[false, false, false],
				[false, false, false],
				[false, false, false],
			]);
		});

		function simulatePlaysAndVerifyResults(testData: videoTestRow[]): void {
			testData.forEach((expectedResults, videoPlayIndex) => {
				const videoNumber = videoPlayIndex + 1;
				expect(helper.shouldPlayPreroll(videoNumber, `testMediaId-${videoNumber}`)).to.equal(
					expectedResults[0],
				);
				expect(helper.shouldPlayMidroll(videoNumber, `testMediaId-${videoNumber}`)).to.equal(
					expectedResults[1],
				);
				expect(helper.shouldPlayPostroll(videoNumber, `testMediaId-${videoNumber}`)).to.equal(
					expectedResults[2],
				);
			});
		}
	});
});
