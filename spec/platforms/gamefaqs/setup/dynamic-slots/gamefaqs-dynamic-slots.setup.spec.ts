import { expect } from 'chai';
import sinon from 'sinon';

import { GamefaqsDynamicSlotsSetup } from '../../../../../src/platforms/gamefaqs/setup/dynamic-slots/gamefaqs-dynamic-slots.setup';
import { context, utils } from '../../../../../src/core';
import { createHtmlElementStub } from '../../../../spec-utils/html-element.stub';

describe('Inserting dynamic slots on GameFAQs', () => {
	const sandbox = sinon.createSandbox();
	let querySelectorAllStub;

	beforeEach(() => {
		querySelectorAllStub = sandbox.stub(document, 'querySelectorAll');
		context.set('state.adStack', []);
		context.set('events.pushOnScroll.ids', []);
		context.set('slots', {});
	});

	afterEach(() => {
		sandbox.restore();
		context.remove('state.adStack');
		context.remove('events.pushOnScroll.ids');
		context.remove('slots');
	});

	it('works as expected for no slots found on the page', () => {
		querySelectorAllStub.returns([] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page but without a wrapper', () => {
		const slotElementStub = createHtmlElementStub(sandbox, 'div');
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for slots found on the page', () => {
		const slotElementStub = createHtmlElementStub(sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-slot');
		sandbox
			.stub(utils.Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(1);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(0);
	});

	it('works as expected for a lazy-load slot found on the page', () => {
		const slotElementStub = createHtmlElementStub(sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-lazy-slot');
		sandbox
			.stub(utils.Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		context.set('slots.test-ad-lazy-slot.lazyLoad', true);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
		expect(context.get('events.pushOnScroll.ids').length).to.eq(1);
	});
});
