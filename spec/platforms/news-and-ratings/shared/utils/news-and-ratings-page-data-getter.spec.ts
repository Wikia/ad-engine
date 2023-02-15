import { context } from '@wikia/core';
import { NewsAndRatingsPageDataGetter } from '@wikia/platforms/news-and-ratings/shared';
import { expect } from 'chai';

describe('NewsAndRatingsPageDataGetter', () => {
	let metadataGetter;
	let metadataGetterStub;
	let utagDataStub;

	beforeEach(() => {
		metadataGetter = new NewsAndRatingsPageDataGetter();
		metadataGetterStub = global.sandbox.stub(metadataGetter, 'getDataSettingsFromMetaTag');
		utagDataStub = global.sandbox.stub(metadataGetter, 'getUtagData');
		context.set('custom.property', 'test');
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('custom.property');
	});

	describe('getPagePath', () => {
		it('returns proper page path based on meta tag - happy path', () => {
			metadataGetterStub.returns({ unit_name: '/123/aw-test/home' });

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('returns proper page path when it is empty based on meta tag', () => {
			metadataGetterStub.returns({ unit_name: '/123/aw-test' });

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});

		it('sets proper page path when it is complex based on meta tag', () => {
			metadataGetterStub.returns({ unit_name: '/123/aw-test/playstation/home' });

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('/playstation/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag', () => {
			metadataGetterStub.returns(null);
			utagDataStub.returns({ siteSection: 'home' });

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('sets proper page path based - no unit_name in ad-settings meta tag', () => {
			metadataGetterStub.returns({ foo: 'bar' });
			utagDataStub.returns({ siteSection: 'home' });

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no data from utag data', () => {
			metadataGetterStub.returns(null);
			utagDataStub.returns({});

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no utag', () => {
			metadataGetterStub.returns(null);
			utagDataStub.returns(undefined);

			const pagePath = metadataGetter.getPagePath();

			expect(pagePath).to.eq('');
		});
	});
});
