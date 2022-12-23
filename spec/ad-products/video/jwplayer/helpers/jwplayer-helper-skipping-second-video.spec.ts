import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '@wikia/core';
import { JWPlayerHelperSkippingSecondVideo } from '@wikia/ad-products/video/jwplayer/helpers';

type shouldPrerollAppear = boolean;
type shouldMidrollAppear = boolean;
type shouldPostrollAppear = boolean;
type videoTestRow = [shouldPrerollAppear, shouldMidrollAppear, shouldPostrollAppear];

describe('JWPlayerHelperSkippingSecondVideo', () => {
	const sandbox = createSandbox();
	let adSlotStub, helper;

	describe('should play pre-, mid- and post-rolls depending on the settings', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: sandbox.stub().returns(true),
			};

			helper = new JWPlayerHelperSkippingSecondVideo(adSlotStub, null, null);

			context.set('options.video.playAdsOnNextVideo', true);
			context.set('options.video.isMidrollEnabled', false);
			context.set('options.video.isPostrollEnabled', false);
		});

		afterEach(() => {
			sandbox.restore();

			context.remove('options.video.playAdsOnNextVideo');
			context.remove('options.video.isMidrollEnabled');
			context.remove('options.video.isPostrollEnabled');
		});

		it('works correctly for the default settings - no ad for the 2nd video, no midroll, no postroll', () => {
			simulatePlaysAndVerifyResults([
				[true, false, false],
				[false, false, false],
				[true, false, false],
			]);
		});

		it('works correctly when mid- and post-rolls are enabled - no ad for the 2nd video', () => {
			context.set('options.video.isMidrollEnabled', true);
			context.set('options.video.isPostrollEnabled', true);

			simulatePlaysAndVerifyResults([
				[true, true, true],
				[false, false, false],
				[true, true, true],
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

		function simulatePlaysAndVerifyResults(testData: videoTestRow[]): void {
			testData.forEach((expectedResults, videoPlayIndex) => {
				const videoNumber = videoPlayIndex + 1;
				expect(helper.shouldPlayPreroll(videoNumber)).to.equal(expectedResults[0]);
				expect(helper.shouldPlayMidroll(videoNumber)).to.equal(expectedResults[1]);
				expect(helper.shouldPlayPostroll(videoNumber)).to.equal(expectedResults[2]);
			});
		}
	});
});
