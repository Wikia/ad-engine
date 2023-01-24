import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context, InstantConfigService, utils } from '@wikia/core';
import { NewsAndRatingsBaseContextSetup } from '@wikia/platforms/news-and-ratings/shared';

describe('News and Ratings base context setup', () => {
	const sandbox = createSandbox();
	let instantConfigStub, utilsClientIsDesktopStub;

	beforeEach(() => {
		utilsClientIsDesktopStub = sandbox.stub(utils.client, 'isDesktop');
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		context.set('custom.property', 'test');
		context.set('custom.device', undefined);
	});

	afterEach(() => {
		sandbox.restore();
		utilsClientIsDesktopStub.resetHistory();
		context.remove('custom.property');
		context.remove('custom.device');
		context.remove('custom.pagePath');
	});

	describe('setBaseState()', () => {
		it('sets proper device custom key for desktop', () => {
			utilsClientIsDesktopStub.returns(true);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('');
		});

		it('sets proper device custom key for mobile', () => {
			utilsClientIsDesktopStub.returns(false);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('m');
		});

		it('sets proper page path based on meta tag - happy path', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test/home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path when it is empty based on meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});

		it('sets proper page path when it is complex based on meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ unit_name: '/123/aw-test/playstation/home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/playstation/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({ siteSection: 'home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path based - no unit_name in ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns({ foo: 'bar' });
			const getUtagDataStub = sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({ siteSection: 'home' });

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no data from utag data', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns({});

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});

		it('sets proper page path based - incorrect ad-settings meta tag and no utag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(null);
			const getUtagDataStub = sandbox.stub(baseContextSetup, 'getUtagData');
			getUtagDataStub.returns(undefined);

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});
	});
});
