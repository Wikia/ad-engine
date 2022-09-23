import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '@wikia/ad-engine';
import { JWPlayerHelper } from '@wikia/ad-products/video/jwplayer/helpers/jwplayer-helper';

describe('JWPlayer helper', () => {
	const sandbox = createSandbox();
	let adSlotStub, helper;

	describe('should play pre-, mid- and post-rolls depending on the settings', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: sandbox.stub().returns(true),
			};

			helper = new JWPlayerHelper(adSlotStub, null, null);

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
			expect(helper.shouldPlayPreroll(1)).to.be.true;
			expect(helper.shouldPlayMidroll(1)).to.be.false;
			expect(helper.shouldPlayPostroll(1)).to.be.false;

			expect(helper.shouldPlayPreroll(2)).to.be.false;
			expect(helper.shouldPlayMidroll(2)).to.be.false;
			expect(helper.shouldPlayPostroll(2)).to.be.false;

			expect(helper.shouldPlayPreroll(3)).to.be.true;
			expect(helper.shouldPlayMidroll(3)).to.be.false;
			expect(helper.shouldPlayPostroll(3)).to.be.false;
		});

		it('works correctly when mid- and post-rolls are enabled - no ad for the 2nd video', () => {
			context.set('options.video.isMidrollEnabled', true);
			context.set('options.video.isPostrollEnabled', true);

			expect(helper.shouldPlayPreroll(1)).to.be.true;
			expect(helper.shouldPlayMidroll(1)).to.be.true;
			expect(helper.shouldPlayPostroll(1)).to.be.true;

			expect(helper.shouldPlayPreroll(2)).to.be.false;
			expect(helper.shouldPlayMidroll(2)).to.be.false;
			expect(helper.shouldPlayPostroll(2)).to.be.false;

			expect(helper.shouldPlayPreroll(3)).to.be.true;
			expect(helper.shouldPlayMidroll(3)).to.be.true;
			expect(helper.shouldPlayPostroll(3)).to.be.true;
		});

		it('works correctly when the ads for next videos are disabled - only one preroll', () => {
			context.set('options.video.playAdsOnNextVideo', false);

			expect(helper.shouldPlayPreroll(1)).to.be.true;
			expect(helper.shouldPlayMidroll(1)).to.be.false;
			expect(helper.shouldPlayPostroll(1)).to.be.false;

			expect(helper.shouldPlayPreroll(2)).to.be.false;
			expect(helper.shouldPlayMidroll(2)).to.be.false;
			expect(helper.shouldPlayPostroll(2)).to.be.false;

			expect(helper.shouldPlayPreroll(3)).to.be.false;
			expect(helper.shouldPlayMidroll(3)).to.be.false;
			expect(helper.shouldPlayPostroll(3)).to.be.false;
		});
	});
});
