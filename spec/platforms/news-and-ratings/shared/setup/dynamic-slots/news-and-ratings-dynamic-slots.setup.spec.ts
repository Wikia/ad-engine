import { expect } from 'chai';

import { context, utils } from '@wikia/core';
import { NewsAndRatingsDynamicSlotsSetup } from '@wikia/platforms/news-and-ratings/shared/setup/dynamic-slots/news-and-ratings-dynamic-slots.setup';

import { createHtmlElementStub } from '../../../../../helpers/html-element.stub';

describe('Inserting dynamic slots on NnR', () => {
	let querySelectorAllStub;

	beforeEach(() => {
		querySelectorAllStub = global.sandbox.stub(document, 'querySelectorAll');
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

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page but without a wrapper', () => {
		const slotElementStub = createHtmlElementStub(global.sandbox, 'div');
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page', () => {
		const slotElementStub = createHtmlElementStub(global.sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-slot');
		global.sandbox
			.stub(utils.Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(global.sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(1);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for a lazy-load slot found on the page', () => {
		const slotElementStub = createHtmlElementStub(global.sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-lazy-slot');
		global.sandbox
			.stub(utils.Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(global.sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		context.set('slots.test-ad-lazy-slot.lazyLoad', true);

		const dynamicSlotsSetup = new NewsAndRatingsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(1);
	});
});
