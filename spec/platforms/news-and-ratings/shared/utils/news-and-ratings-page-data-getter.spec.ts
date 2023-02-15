import { context } from '@wikia/core';
import { NewsAndRatingsPageDataGetter } from '@wikia/platforms/news-and-ratings/shared';
import { expect } from 'chai';

describe('NewsAndRatingsPageDataGetter', () => {
	let pageDataGetter;
	let pageDataGetterStub;
	let utagDataStub;

	beforeEach(() => {
		pageDataGetter = new NewsAndRatingsPageDataGetter();
		pageDataGetterStub = global.sandbox.stub(pageDataGetter, 'getDataSettingsFromMetaTag');
		utagDataStub = global.sandbox.stub(pageDataGetter, 'getUtagData');
		context.set('custom.property', 'test');
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('custom.property');
	});

	describe('getPagePath', () => {
		it('returns proper page path based on meta tag - happy path', () => {
			pageDataGetterStub.returns({ unit_name: '/123/aw-test/home' });

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('returns proper page path when it is empty based on meta tag', () => {
			pageDataGetterStub.returns({ unit_name: '/123/aw-test' });

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});

		it('returns proper page path when it is complex based on meta tag', () => {
			pageDataGetterStub.returns({ unit_name: '/123/aw-test/playstation/home' });

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('/playstation/home');
		});

		it('returns proper page path based - incorrect ad-settings meta tag', () => {
			pageDataGetterStub.returns(null);
			utagDataStub.returns({ siteSection: 'home' });

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('returns proper page path based - no unit_name in ad-settings meta tag', () => {
			pageDataGetterStub.returns({ foo: 'bar' });
			utagDataStub.returns({ siteSection: 'home' });

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('returns proper page path based - incorrect ad-settings meta tag and no data from utag data', () => {
			pageDataGetterStub.returns(null);
			utagDataStub.returns({});

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});

		it('returns proper page path based - incorrect ad-settings meta tag and no utag', () => {
			pageDataGetterStub.returns(null);
			utagDataStub.returns(undefined);

			const pagePath = pageDataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});
	});
});
