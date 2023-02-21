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
});
