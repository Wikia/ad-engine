import { expect } from 'chai';

import { context, InstantConfigService } from '@wikia/core';
import { NewsAndRatingsBaseContextSetup } from '@wikia/platforms/news-and-ratings/shared';

describe('News and Ratings base context setup', () => {
	let instantConfigStub;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		context.set('custom.region', 'test');
		context.set('custom.property', 'test');
		context.set('custom.device', undefined);
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('state.isMobile');
		context.remove('custom.dfpId');
		context.remove('custom.region');
		context.remove('custom.property');
		context.remove('custom.device');
		context.remove('custom.pagePath');
		context.remove('services.anyclip.isApplicable');
		context.remove('vast.adUnitId');
	});

	describe('setBaseState()', () => {
		it('sets proper device custom key for desktop', () => {
			context.set('state.isMobile', false);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('');
		});

		it('sets proper device custom key for mobile', () => {
			context.set('state.isMobile', true);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('m');
		});

		it('sets proper page path based on meta tag - happy path', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test/home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path when it is empty based on meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});

		it('sets proper page path when it is complex based on meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test/playstation/home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/playstation/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = global.sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({ siteSection: 'home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path based - no unit_name in ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ foo: 'bar' });
			const getUtagDataStub = global.sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({ siteSection: 'home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no data from utag data', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = global.sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({});

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no utag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = global.sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns(undefined);

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});
	});

	describe('setupVideoOptions()', () => {
		it('makes Anyclip applicable when it is enabled on backend via ad-settings param (ComicVine)', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ anyclip: 'active' });

			baseContextSetup.execute();
			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.true;
		});

		it('does not make Anyclip applicable when it is disabled on backend (ComicVine)', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns();

			baseContextSetup.execute();
			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.false;
		});

		// TODO: once backend responses in unified way let's remove the logic and test below (ADEN-12794)
		it('makes Anyclip applicable when it is enabled on backend via targeting params (GameFAQs)', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ target_params: { anyclip: '1' } });

			baseContextSetup.execute();
			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.true;
		});

		// TODO: once backend responses in unified way let's remove the logic and test below (ADEN-12794)
		it('does not make Anyclip applicable when it is disabled on backend (GameFAQs)', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = global.sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ target_params: { foo: 'bar' } });

			baseContextSetup.execute();
			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.false;
		});

		it('sets up proper VAST ad unit for mobile', () => {
			// given
			context.set('state.isMobile', true);

			// when
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			// then
			expect(context.get('vast.adUnitId')).to.equal('5441/vtest-test/mobile');
		});

		it('sets up proper VAST ad unit for desktop', () => {
			// given
			context.set('state.isMobile', false);

			// when
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			// then
			expect(context.get('vast.adUnitId')).to.equal('5441/vtest-test/desktop');
		});
	});
});
