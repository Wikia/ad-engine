import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '@wikia/ad-engine';
import { JwplayerHelperSkippingSponsoredVideo } from '@wikia/ad-products/video/jwplayer/helpers';

type shouldPrerollAppear = boolean;
type shouldMidrollAppear = boolean;
type shouldPostrollAppear = boolean;
type videoTestRow = [shouldPrerollAppear, shouldMidrollAppear, shouldPostrollAppear];

describe('JwplayerHelperSkippingSponsoredVideo', () => {
	const sandbox = createSandbox();
	let adSlotStub, helper;

	describe('should play pre-, mid- and post-rolls depending on the settings', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: sandbox.stub().returns(true),
			};
			window.sponsoredVideos = [];
			helper = new JwplayerHelperSkippingSponsoredVideo(adSlotStub, null, null);

			context.set('options.video.playAdsOnNextVideo', true);
			context.set('options.video.isMidrollEnabled', false);
			context.set('options.video.isPostrollEnabled', false);
		});

		afterEach(() => {
			sandbox.restore();

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
			helper = new JwplayerHelperSkippingSponsoredVideo(adSlotStub, null, null);
			window.sponsoredVideos = ['testMediaId-3'];

			simulatePlaysAndVerifyResults([
				[true, false, false],
				[true, false, false],
				[false, false, false],
			]);
		});

		it('works correctly when the 1st ad is a sponsored one', () => {
			helper = new JwplayerHelperSkippingSponsoredVideo(adSlotStub, null, null);
			window.sponsoredVideos = ['testMediaId-1'];

			simulatePlaysAndVerifyResults([
				[false, false, false],
				[true, false, false],
				[true, false, false],
			]);
		});

		it('works correctly when there is no global window.sponsoredVideos', () => {
			helper = new JwplayerHelperSkippingSponsoredVideo(adSlotStub, null, null);
			window.sponsoredVideos = undefined;

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
