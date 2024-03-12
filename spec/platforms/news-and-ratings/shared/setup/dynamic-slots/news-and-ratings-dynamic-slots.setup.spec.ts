import { expect } from 'chai';

import { context } from '@wikia/core';
import { Document } from '@wikia/core/utils';
import { NewsAndRatingsDynamicSlotsSetup } from '@wikia/platforms/news-and-ratings/shared/setup/dynamic-slots/news-and-ratings-dynamic-slots.setup';

import { NewsAndRatingsSlotsDefinitionRepository } from '@wikia/platforms/news-and-ratings/shared';
import { createHtmlElementStub } from '../../../../../helpers/html-element.stub';

describe('Inserting dynamic slots on NnR', () => {
	let querySelectorAllStub, slotsDefinitionRepositoryStub;

	beforeEach(() => {
		querySelectorAllStub = global.sandbox.stub(document, 'querySelectorAll');
		slotsDefinitionRepositoryStub = global.sandbox.createStubInstance(
			NewsAndRatingsSlotsDefinitionRepository,
		);
		slotsDefinitionRepositoryStub.getInterstitialConfig.returns(null);
		context.set('state.adStack', []);
		context.set('events.pushOnScroll.ids', []);
		context.set('slots', {});
	});

	afterEach(() => {
		context.remove('state.adStack');
		context.remove('events.pushOnScroll.ids');
		context.remove('slots');
	});

	it('works as expected for no slots found on the page', () => {
		querySelectorAllStub.returns([] as any);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup(slotsDefinitionRepositoryStub);
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page but without a wrapper', () => {
		const slotElementStub = createHtmlElementStub(global.sandbox, 'div');
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup(slotsDefinitionRepositoryStub);
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page', () => {
		const slotElementStub = createHtmlElementStub(global.sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-slot');
		global.sandbox
			.stub(Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(global.sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup(slotsDefinitionRepositoryStub);
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(1);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});
});
