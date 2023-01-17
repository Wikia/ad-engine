import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context, utils } from '@wikia/core';
import { NewsAndRatingsBaseContextSetup } from '@wikia/platforms/news-and-ratings/shared';
import { InstantConfigService } from '@wikia/ad-services';

describe('News and Ratings base context setup', () => {
	const sandbox = createSandbox();
	let instantConfigStub, utilsClientIsDesktopStub;

	beforeEach(() => {
		utilsClientIsDesktopStub = sandbox.stub(utils.client, 'isDesktop');
		instantConfigStub = sandbox.createStubInstance(InstantConfigService);
		context.set('custom.device', undefined);
	});

	afterEach(() => {
		sandbox.restore();
		utilsClientIsDesktopStub.resetHistory();
		context.remove('custom.device');
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

		it('sets proper page path based - happy path', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(`{"unit_name": "/123/aw-test/home"}`);

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('/home');
		});

		it('sets proper page path based - no unit_name in ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns(`{}`);

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});

		it('sets proper page path based - no ad-settings meta tag', () => {
			const baseContextSetup = new NewsAndRatingsBaseContextSetup(instantConfigStub);
			const getDataSettingsFromMetaTagStub = sandbox.stub(
				baseContextSetup,
				'getDataSettingsFromMetaTag',
			);
			getDataSettingsFromMetaTagStub.returns('');

			baseContextSetup.execute();

			expect(context.get('custom.pagePath')).to.eq('');
		});
	});
});
