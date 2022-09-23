import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '@wikia/ad-engine';
import { JWPlayerHelper } from '@wikia/ad-products/video/jwplayer/helpers/jwplayer-helper';

describe('JWPlayer helper', () => {
	const sandbox = createSandbox();
	let adSlotStub;

	describe('shouldPlayPreroll()', () => {
		beforeEach(() => {
			adSlotStub = {
				isEnabled: sandbox.stub().returns(true),
			};

			context.set('options.video.adsOnNextVideoFrequency', 3);
			context.set('options.video.playAdsOnNextVideo', true);
		});

		afterEach(() => {
			sandbox.restore();

			context.remove('options.video.adsOnNextVideoFrequency');
			context.remove('options.video.playAdsOnNextVideo');
		});

		it('returns true when it is the first video', () => {
			const helper = new JWPlayerHelper(adSlotStub, null, null);
			expect(helper.shouldPlayPreroll(1)).to.be.true;
		});

		it('returns false when it is the second video', () => {
			const helper = new JWPlayerHelper(adSlotStub, null, null);
			expect(helper.shouldPlayPreroll(2)).to.be.false;
		});

		it('returns false when it is the third video', () => {
			const helper = new JWPlayerHelper(adSlotStub, null, null);
			expect(helper.shouldPlayPreroll(3)).to.be.false;
		});

		it('returns false when it is the fourth video', () => {
			const helper = new JWPlayerHelper(adSlotStub, null, null);
			expect(helper.shouldPlayPreroll(4)).to.be.true;
		});
	});
});
