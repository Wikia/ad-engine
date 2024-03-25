// @ts-strict-ignore
import { PrebidNativeConfig } from '@wikia/ad-bidders';
import { expect } from 'chai';

describe('Prebid native config', () => {
	describe('getPrebidNativeMediaTypes', () => {
		const setViewportWidth = (width: number): void => {
			global.sandbox.stub(document.documentElement, 'clientWidth').value(width);
			global.sandbox.stub(window, 'innerWidth').value(width);
		};

		it('contains all required fields', () => {
			const mobileNativeMediaTypes = PrebidNativeConfig.getPrebidNativeMediaTypes('desktop');

			expect(Object.keys(mobileNativeMediaTypes)).to.deep.equal([
				'sendTargetingKeys',
				'adTemplate',
				'title',
				'body',
				'clickUrl',
				'displayUrl',
				'image',
			]);
		});

		it('returns proper values for mobile with small screen width', () => {
			setViewportWidth(320);
			const mobileNativeMediaTypes = PrebidNativeConfig.getPrebidNativeMediaTypes('mobile');

			expect(mobileNativeMediaTypes.title.len).to.equal(40);
			expect(mobileNativeMediaTypes.body.len).to.equal(30);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_width).to.equal(90);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_height).to.equal(90);
		});

		it('returns proper values for mobile with wider screen width', () => {
			setViewportWidth(375);
			const mobileNativeMediaTypes = PrebidNativeConfig.getPrebidNativeMediaTypes('mobile');

			expect(mobileNativeMediaTypes.title.len).to.equal(40);
			expect(mobileNativeMediaTypes.body.len).to.equal(30);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_width).to.equal(120);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_height).to.equal(120);
		});

		it('returns proper values for destkop', () => {
			const mobileNativeMediaTypes = PrebidNativeConfig.getPrebidNativeMediaTypes('desktop');

			expect(mobileNativeMediaTypes.title.len).to.equal(60);
			expect(mobileNativeMediaTypes.body.len).to.equal(120);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_width).to.equal(126);
			expect(mobileNativeMediaTypes.image.aspect_ratios[0].min_height).to.equal(126);
		});
	});
});
