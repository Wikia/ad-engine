import { expect } from 'chai';

import { context, InstantConfigService } from '@wikia/core';
import {
	NewsAndRatingsBaseContextSetup,
	NewsAndRatingsPageDataGetter,
} from '@wikia/platforms/news-and-ratings/shared';

describe('News and Ratings base context setup', () => {
	let instantConfigStub;
	let newsAndRatingsPageDataGetterStub;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		newsAndRatingsPageDataGetterStub = global.sandbox.createStubInstance(
			NewsAndRatingsPageDataGetter,
		);
		context.set('custom.property', 'test');
		context.set('custom.device', undefined);
	});

	afterEach(() => {
		global.sandbox.restore();
		context.remove('state.isMobile');
		context.remove('custom.property');
		context.remove('custom.device');
		context.remove('services.anyclip.isApplicable');
	});

	describe('setBaseState()', () => {
		it('sets proper device custom key for desktop', () => {
			context.set('state.isMobile', false);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(
				instantConfigStub,
				newsAndRatingsPageDataGetterStub,
			);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('');
		});

		it('sets proper device custom key for mobile', () => {
			context.set('state.isMobile', true);
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(
				instantConfigStub,
				newsAndRatingsPageDataGetterStub,
			);
			baseContextSetup.execute();

			expect(context.get('custom.device')).to.eq('m');
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
	});
});
